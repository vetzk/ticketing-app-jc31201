import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEvent = async (req: Request, res: Response) => {
  try {
    const { title, start, end, paymentMethod, paymentCost, category, description, image } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        paymentMethod,
        paymentCost,
        category,
        description,
        image,
        views: 0,
        visitorsThisMonth: 0,
        visitorsLastMonth: 0,
        visitorsThisWeek: 0,
        visitorsLastWeek: 0,
      },
    });

    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Failed to create event'});
  }
};
export const getEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id) },
    });

    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve event' });
  }
};  

export const getEvents = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, start, end, paymentMethod, paymentCost, category, description, image } = req.body;

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        start,
        end,
        paymentMethod,
        paymentCost,
        category,
        description,
        image,
      },
    });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update event' });
  }
};

export const deleteEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.event.delete({
      where: { id: parseInt(id) },
    });

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete event' });
  }
};  

