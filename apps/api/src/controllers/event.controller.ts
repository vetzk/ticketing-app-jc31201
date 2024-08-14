import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createEvent = async (req: Request, res: Response) => {
  try {
    const {
      title,
      start,
      end,
      paymentMethod,
      paymentCost,
      category,
      description,
      descriptionDetail = "No details provided", // Provide default value if not supplied
      image,
      location,
      seat,
      voucerCode,
      coinUser,
    } = req.body;

    const event = await prisma.event.create({
      data: {
        title,
        start: new Date(start),
        end: new Date(end),
        paymentMethod: paymentMethod || null, // Handle nullable fields
        paymentCost: paymentCost || null,     // Handle nullable fields
        category,
        description,
        descriptionDetail,
        image: image || null,                 // Handle nullable fields
        location: location || null,           // Handle nullable fields
        seat: seat || null,                   // Nullable seat field
        voucerCode: voucerCode || null,       // Nullable voucher code
        coinUser: coinUser || 0,              // Handle coinUser if it's optional or set to 0
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
    res.status(500).json({ error: 'Failed to create event' });
  }
};

export const getEvent = async (req: Request, res: Response) => {
  try {
    const events = await prisma.event.findMany();
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
};

export const gettingEvents = async (req: Request, res: Response) => {
  try {
    const { title, id, page } = req.query;
    const eventsPerPage = 10;
    const pageNumber = parseInt(page as string, 10) || 1;

    let events;

    if (id) {
      events = await prisma.event.findUnique({
        where: { id: parseInt(id as string) },
      });
      if (!events) return res.status(404).json({ error: 'Event not found' });
    } else if (title) {
      events = await prisma.event.findMany({
        where: {
          title: {
            contains: String(title),
          },
        },
        skip: (pageNumber - 1) * eventsPerPage,
        take: eventsPerPage,
      });
    } else {
      events = await prisma.event.findMany({
        skip: (pageNumber - 1) * eventsPerPage,
        take: eventsPerPage,
      });
    }

    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Failed to retrieve events' });
  }
};

export const getEventByTitle = async (req: Request, res: Response) => {
  try {
    const { title } = req.params;
    const event = await prisma.event.findFirst({
      where: { title },
    });

    if (!event) return res.status(404).json({ error: 'Event not found' });

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve event' });
  }
};

export const updateEvent = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      title,
      start,
      end,
      paymentMethod,
      paymentCost,
      category,
      description,
      descriptionDetail = "No details provided",
      image,
      location,
      seat,
      voucerCode,
      coinUser,
    } = req.body;

    const event = await prisma.event.update({
      where: { id: parseInt(id) },
      data: {
        title,
        start: start ? new Date(start) : undefined,
        end: end ? new Date(end) : undefined,
        paymentMethod: paymentMethod || null,
        paymentCost: paymentCost || null,
        category,
        description,
        descriptionDetail,
        image: image || null,
        location: location || null,
        seat: seat || null,
        voucerCode: voucerCode || null,
        coinUser: coinUser || 0,
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
