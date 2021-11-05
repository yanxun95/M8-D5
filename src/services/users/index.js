import express from "express";
import UserModel from "./schema.js";
import AccommodationModel from "../accommodations/schema.js";
import { basicAuthMiddleware } from "../../auth/basic.js";
import { JWTAuthenticate } from "../../auth/tools.js";
import { JWTAuthMiddleware } from "../../auth/token.js";
import createHttpError from "http-errors";
import passport from "passport";

const userRouter = express.Router();

userRouter.post("/register", async (req, res, next) => {
  try {
    const newAuthor = new UserModel(req.body);
    const { _id } = await newAuthor.save();
    res.status(201).send({ _id });
  } catch (error) {
    next(error);
  }
});

userRouter.post("/login", async (req, res, next) => {
  try {
    // 1. Get email and password from req.body
    const { email, password } = req.body;

    // 2. Verify credentials
    const user = await UserModel.checkCredentials(email, password);

    if (user) {
      // 3. If credentials are ok we are going to generate access token and refresh token
      const accessToken = await JWTAuthenticate(user);

      // 4. Send token back as a response
      res.send({ accessToken });
    } else {
      next(createHttpError(401, "Credentials are not ok!"));
    }
  } catch (error) {
    next(error);
  }
});

// userRouter.get("/me", basicAuthMiddleware, async (req, res, next) => {
//   try {
//     console.log("id:", req.user._id);
//     const posts = await AccommodationModel.find({
//       user: req.user._id.toString(),
//     });

//     res.status(200).send(posts);
//   } catch (error) {
//     next(error);
//   }
// });

userRouter.get("/me", JWTAuthMiddleware, async (req, res, next) => {
  try {
    res.send(req.user);
  } catch (error) {
    next(error);
  }
});

userRouter.get(
  "/me/accommodation",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const accommodations = await AccommodationModel.find({
        host: req.user._id.toString(),
      });

      res.send(accommodations);
    } catch (error) {
      next(error);
    }
  }
);

export default userRouter;
