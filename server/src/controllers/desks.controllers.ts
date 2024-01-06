import { RequestHandler } from 'express';
import { getDesksService } from '../services/desks.service';

type RequestParams = {
  tableIds?: string[]
  interval: { count: number, unit: 'day' | 'week' | 'month' | 'year' }
}
export const getDesks: RequestHandler = (req, res, next) => {
  const request = req.body as RequestParams;
  const data = getDesksService(request);
  res.status(200).json({ data });
};
