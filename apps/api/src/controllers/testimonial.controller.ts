

import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export class TestimonialController {
  private prisma: PrismaClient;

  constructor() {
    this.prisma = new PrismaClient();
  }

  async createTestimonial(req: Request, res: Response) {
    const { userId, eventId, reviewDescription, rating } = req.body;

    try {
      const event = await this.prisma.event.findUnique({
        where: { id: eventId },
      });

      if (!event || event.statusEvent !== 'ENDED') {
        return res.status(400).send({ message: 'Event has not ended yet or does not exist.' });
      }

      const purchasedTicket = await this.prisma.ticket.findFirst({
        where: { userId, eventId, status: 'PAID' },
      });

      if (!purchasedTicket) {
        return res.status(400).send({ message: 'User has not purchased this event.' });
      }

      const newTestimonial = await this.prisma.testimonial.create({
        data: { userId, eventId, reviewDescription, rating },
      });

      res.send(newTestimonial);
    } catch (error) {
      res.status(500).send({ message: 'Failed to create testimonial.', error });
    }
  }

  async readTestimonial(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const testimonial = await this.prisma.testimonial.findUnique({
        where: { id: parseInt(id, 10) },
      });

      if (!testimonial) {
        return res.status(404).send({ message: 'Testimonial not found.' });
      }

      res.send(testimonial);
    } catch (error) {
      res.status(500).send({ message: 'Failed to retrieve testimonial.', error });
    }
  }

  async updateTestimonial(req: Request, res: Response) {
    const { id } = req.params;
    const { reviewDescription, rating } = req.body;

    try {
      const testimonial = await this.prisma.testimonial.update({
        where: { id: parseInt(id, 10) },
        data: { reviewDescription, rating },
      });

      res.send(testimonial);
    } catch (error) {
      res.status(500).send({ message: 'Failed to update testimonial.', error });
    }
  }

  async deleteTestimonial(req: Request, res: Response) {
    const { id } = req.params;

    try {
      await this.prisma.testimonial.delete({
        where: { id: parseInt(id, 10) },
      });

      res.send({ message: 'Testimonial deleted successfully.' });
    } catch (error) {
      res.status(500).send({ message: 'Failed to delete testimonial.', error });
    }
  }
}






//  example post 
// {
//   "userId": 1,
//   "eventId": 2,
//   "reviewDescription": "The event was amazing, well-organized, and very informative!",
//   "rating": 5
// }

// example writte json.body to output from field form json.body 
// have effect if event closed status and done buy user can comment because is before done buy event 
// around comment user can Crud card event if user needed 
// dont forget .json change .send to term code standar 



