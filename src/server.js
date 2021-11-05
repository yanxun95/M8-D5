import express from "express";
import mongoose from "mongoose";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import userRouter from "./services/users/index.js";
import accommodationRouter from "./services/accommodations/index.js";
import {
  notFoundHandler,
  badRequestHandler,
  genericErrorHandler,
  forbiddenHandler,
} from "./errorHandlers.js";
import passport from "passport";
import cookieParser from "cookie-parser";
// import GoogleStrategy from "./services/auth/oauth.js";
const server = express();

const port = process.env.PORT || 3001;

// ************************* MIDDLEWARES ********************************
// passport.use("google", GoogleStrategy);

// server.use(cors({ origin: "http://localhost:3000", credentials: true }));
server.use(cors());
server.use(express.json());
server.use(cookieParser());
// server.use(passport.initialize());

// ************************* ROUTES ************************************

server.use("/user", userRouter);
server.use("/accommodation", accommodationRouter);

// ************************** ERROR HANDLERS ***************************

server.use(notFoundHandler);
server.use(badRequestHandler);
server.use(forbiddenHandler);
server.use(genericErrorHandler);

mongoose.connect(process.env.MONGO_CONNECTION);

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!");
  server.listen(port, () => {
    console.table(listEndpoints(server));
    console.log(`Server running on port ${port}`);
  });
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});
