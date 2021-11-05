import mongoose from "mongoose";

const { Schema, model } = mongoose;

const accommodationSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    maxGuests: { type: Number, required: true },
    located: { type: String, required: true },
    host: { type: Schema.ObjectId, ref: "user" },
  },
  {
    timestamps: true,
  }
);

accommodationSchema.methods.toJSON = function () {
  // this is executed automatically EVERY TIME express does a res.send

  const userDocument = this;
  const userObject = userDocument.toObject();
  delete userObject.__v;
  delete userObject.host.password;
  delete userObject.host.__v;
  delete userObject.host.createdAt;
  delete userObject.host.updatedAt;

  return userObject;
};

export default model("Accommodation", accommodationSchema);
