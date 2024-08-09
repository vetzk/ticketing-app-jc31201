import { Request, Response, NextFunction } from 'express';

export const validateEventCreation = (req: Request, res: Response, next: NextFunction) => {
  const { title, description, price, locationId, startTime, endTime, categoryId, ticketType } = req.body;

  if (!title || !description || !locationId || !startTime || !endTime || !categoryId || !ticketType) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  if (price < 0) {
    return res.status(400).json({ success: false, message: 'Price cannot be negative' });
  }

  if (new Date(startTime) >= new Date(endTime)) {
    return res.status(400).json({ success: false, message: 'Start time must be before end time' });
  }

  next();
};
