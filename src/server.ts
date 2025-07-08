import "dotenv/config";

import mongoose from "mongoose";
import cors from "cors";

import app from "./app";
import express from "express";
import { errorHandler } from "./utils/middleware/error";

mongoose.connect(process.env.DB_URL || "");

const port = 3000;

const allowedOrigins = ["*"];
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
