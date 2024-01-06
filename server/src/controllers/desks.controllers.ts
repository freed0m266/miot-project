import { RequestHandler } from 'express';
import { getDesksService } from '../services/desks.service';

type RequestParams = {
  deskIds?: string[]
  count: number;
  unit: 'day' | 'week' | 'month' | 'year';
}
export const getDesks: RequestHandler = (req, res, next) => {
  const request = req.query as unknown as RequestParams;

  const data = getDesksService(request);
  res.status(200).json({ data });
};
