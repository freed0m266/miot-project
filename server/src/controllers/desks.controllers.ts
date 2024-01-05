import { RequestHandler } from "express";
import { getDesksSer } from "../services/desks.service";

export const getDesks: RequestHandler = (req, res, next) => {
  var data = getDesksSer();
  console.log(data);
  res.status(200).json({ data: data });
};
