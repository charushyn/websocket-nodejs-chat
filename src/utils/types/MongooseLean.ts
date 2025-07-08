import { FlattenMaps, Types } from "mongoose";

export type MongooseLean<T> = FlattenMaps<T> & {
  _id: Types.ObjectId;
  __v?: number;
};
