import mongoose from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String },
    role: { type: String, default: "guest", enum: ["guest", "Host"] },
    googleId: { type: String },
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

userSchema.pre("save", async function (next) {
  // BEFORE saving the user in db, hash the password
  const newUser = this; // this refers to the current user trying to be saved in db
  const plainPW = newUser.password;

  if (newUser.isModified("password")) {
    // only if user is modifying the password we are going to use CPU cycles to calculate the hash
    newUser.password = await bcrypt.hash(plainPW, 10);
  }
  next();
});

userSchema.methods.toJSON = function () {
  const userDocument = this;
  const userObject = userDocument.toObject();
  delete userObject.password;
  delete userObject.__v;

  return userObject;
};

userSchema.statics.checkCredentials = async function (email, plainPW) {
  // 1. find the user by email
  const user = await this.findOne({ email }); // "this" refers to UserModel

  if (user) {
    // 2. if the user is found we are going to compare plainPW with hashed one
    const isMatch = await bcrypt.compare(plainPW, user.password);
    // 3. Return a meaningful response
    if (isMatch) return user;
    else return null; // if the pw is not ok I'm returning null
  } else return null; // if the email is not ok I'm returning null as well
};

export default model("user", userSchema);
