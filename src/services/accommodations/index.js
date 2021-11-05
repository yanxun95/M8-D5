import express from "express";
import AccommodationModel from "./schema.js";
import { hostMiddleware, JWTAuthMiddleware } from "../../auth/token.js";
import UserModel from "./schema.js";
import mongoose from "mongoose";


import createHttpError from "http-errors";

const accommodationRouter = express.Router();

accommodationRouter.get("/", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accommodation = await AccommodationModel.find().populate("host");
    res.send(accommodation);
  } catch (error) {
    next(error);
  }
});

accommodationRouter.post("/", JWTAuthMiddleware,hostMiddleware, async (req, res, next) => {
  try {
    // const newAccommodation = new AccommodationModel({
    //   ...req.body,
    //   host: req.user._id,
    // });

      const newAccommodation = new AccommodationModel(req.body);
      const { _id } = await newAccommodation.save();
      res.status(201).send({ _id });

  } catch (error) {
    next(error);
  }
});

accommodationRouter.get("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const accommodation = await AccommodationModel.findById(
      req.params.id
    ).populate("host");
    if (accommodation !== null) {
      res.send(accommodation);
    } else {
      res.status(404).send("Not found!");
    }
  } catch (error) {
    next(error);
  }
});

accommodationRouter.put("/:id", JWTAuthMiddleware, async (req, res, next) => {
  try {
    const modifiedAccommodation = await AccommodationModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (modifiedAccommodation) {
      res.send({modifiedAccommodation});
    } else {
      next(
        createHttpError(
          404,
          `Accommodation with id ${req.params.id} not found!`
        )
      );
    }
  } catch (error) {
    next(error);
  }
});
accommodationRouter.delete(
  "/:id",
  JWTAuthMiddleware,
  async (req, res, next) => {
    try {
      const deletedAccommodation = await AccommodationModel.findByIdAndDelete(
        req.params.id
      );

      if (deletedAccommodation) {
        res.send(`NO MORE ACCOMMODATION ID: ${req.params.id}`).status(204)
      } else {
        next(
          createHttpError(
            404,
            `Accommodation with id ${req.params.id} not found!`
          )
        );
      }
    } catch (error) {
      next(error);
    }
  }
);

export default accommodationRouter;
