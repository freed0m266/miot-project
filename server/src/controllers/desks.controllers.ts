import { RequestHandler } from "express";
import {
  createDesksService,
  deleteDesksService,
  getDesksServiceReal,
} from "../services/desks.service";
import { apiKey } from "../main";

type GetRequestParams = {
  zoneId: string;
  deskIds?: string[];
  count?: number;
  unit?: "days" | "weeks" | "months" | "years";
};

type PostDeleteRequestParams = {
  zoneId: string;
  deskId: string;
};

export const getDesks: RequestHandler = async (req, res, next) => {
  const request = req.query as unknown as GetRequestParams;

  const reqApiKey = req.header("api-key");
  if (reqApiKey !== apiKey) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const data = await getDesksServiceReal(request);
  res.status(200).json({ data });
};

export const createDesk: RequestHandler = async (req, res, next) => {
  const request = req.body as unknown as PostDeleteRequestParams;

  const reqApiKey = req.header("api-key");
  if (reqApiKey !== apiKey) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const data = await createDesksService(request);
  if (data == 400) {
    res
      .status(data)
      .json({ message: "Desk with this id already exists in this zone" });
    return;
  }
  if (data == 201) {
    res.status(data).json({ message: "Desk created" });
    return;
  }
  res.status(data).json({ data });
};

export const deleteDesk: RequestHandler = async (req, res, next) => {
  const request = req.query as unknown as PostDeleteRequestParams;

  const reqApiKey = req.header("api-key");
  if (reqApiKey !== apiKey) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  const data = await deleteDesksService(request);
  if (data == null) {
    res.status(404).json({ message: "This desk doesn not exist in this zone" });
    return;
  }
  if (data == 200) {
    res.status(data).json({ message: "Desk deleted" });
    return;
  }
  res.status(data).json({ data });
};
