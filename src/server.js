import { db_url } from "./environment/dev.env.js";
import express from "express";
import mongoose from "mongoose";
import UserRouter from "./routers/UserRouter.js";

export class Server {
  constructor() {
    this.app = express();
    this.connectDB();
    this.configureBodyParser();
    this.routes();
    this.error404Handler();
    this.handleError();
  }

  setApp = () => {
    return this.app;
  };

  connectDB = () => {
    return mongoose
      .connect(db_url, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useCreateIndex: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log("Connected to collection at port 27017");
      })
      .catch((err) => {
        console.log("Connection refused. Retrying in 5 seconds ....");
        setTimeout(this.connectDB, 5000);
      });
  };

  configureBodyParser = () => {
    this.app.use(express.urlencoded({ extended: true }));
  };

  routes = () => {
    this.app.use("/src/uploads", express.static("src/uploads"));
    this.app.use("/api/user", UserRouter);
  };

  error404Handler = () => {
    this.app.use((req, res) => {
      res.status(404).json({
        message: "Not Found",
        status_code: 404,
      });
    });
  };

  handleError = () => {
    this.app.use((error, req, res, next) => {
      const errorStatus = req.errorStatus || 500;
      res.status(errorStatus).json({
        message: error.message || "Something went wrong. Please try again",
        status_code: errorStatus,
      });
    });
  };
}
