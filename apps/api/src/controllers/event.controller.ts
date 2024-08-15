import prisma from '../prisma';
import { EventService } from '../services/event.services';
import { NextFunction, Request, Response } from 'express';

export class EventController {
  private eventService: EventService;
  constructor() {
    this.eventService = new EventService();
  }

  //get event utk admin spesifik utk mendapatkan event yang dibuat saja
  async getUserEvent(req: Request, res: Response, next: NextFunction) {
    try {
      if (!res.locals.decrypt.id) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find token',
        });
      }

      const findUserEvent = await this.eventService.findUserById(
        res.locals.decrypt.id,
      );

      if (!findUserEvent) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find user',
        });
      }

      const getUserEvent = await this.eventService.findUserEvents(
        findUserEvent.id,
      );

      return res.status(200).send({
        success: true,
        result: getUserEvent,
      });
    } catch (error) {
      console.log(res.locals.decrypt);
      console.log(error);
      console.log(res.locals.decrypt.id);

      next({ success: false, message: 'Cannot find your event', error });
    }
  }

  async getAllEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const events = await prisma.event.findMany({
        select: {
          title: true,
          description: true,
          startTime: true,
          endTime: true,
          statusEvent: true,
          price: true,
          isDeleted: true,
          images: {
            select: {
              path: true,
            },
          },
          category: {
            select: {
              categoryName: true,
            },
          },
          location: {
            select: {
              locationName: true,
            },
          },
        },
      });
      return res.status(200).send({
        success: true,
        result: events,
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Failed to get all events',
        error,
      });
    }
  }

  //kalau mau coba addEvent di thunder client harus isi di form nya bukan di JSON,
  //form title, category, dll input langsung di form
  async addEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        title,
        description,
        category,
        price,
        location,
        ticketType,
        startTime,
        endTime,
      } = req.body;

      if (
        !title ||
        !description ||
        !category ||
        !price ||
        !location ||
        !ticketType ||
        !startTime ||
        !endTime
      ) {
        return res.status(401).send({
          success: false,
          message: 'Field cannot be empty',
        });
      }

      const findUserEvent = await this.eventService.findUserById(
        res.locals.decrypt.id,
      );
      if (!findUserEvent) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }
      console.log(findUserEvent);

      const files = req.files as Express.Multer.File[];
      console.log('Uploaded files:', files);

      let findLocation = await this.eventService.findLocationByName(location);

      const imagePaths = files
        ? files.map((file) => `/assets/product/${file.filename}`)
        : [];

      let findCategory = await this.eventService.findCategoryByName(category);

      if (!findLocation) {
        findLocation = await this.eventService.createLocation(location);
      }

      if (!findCategory) {
        findCategory = await this.eventService.createCategory(category);
      }

      const addEventProduct = await prisma.event.create({
        data: {
          title: title,
          userId: res.locals.decrypt.id,
          description,
          images: {
            create: imagePaths.map((path: any) => ({
              path,
            })),
          },
          price: Number(price),
          locationId: findLocation?.id,
          ticketType,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString(),
          categoryId: findCategory?.id,
          isDeleted: false,
        },
        include: {
          images: true,
        },
      });

      return res.status(200).send({
        success: true,
        result: addEventProduct,
      });
    } catch (error) {
      console.log(error);

      next({
        success: false,
        message: 'Cannot add event',
        error,
      });
    }
  }

  async updateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const {
        title,
        description,
        category,
        price,
        location,
        ticketType,
        startTime,
        endTime,
      } = req.body;

      const findUser = await prisma.user.findUnique({
        where: {
          id: res.locals.decrypt.id,
        },
      });

      // const findEvent = await prisma.event.findMany({
      //   where: {
      //     userId: findUser?.id,
      //   },
      // });

      // const findSingleEvent = findEvent.find((e) => e.id === Number(eventId));

      if (!findUser) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      const findUserEvent = await prisma.event.findFirst({
        where: {
          id: Number(eventId),
          userId: findUser.id,
        },
      });

      const findEventCategory = await prisma.category.findFirst({
        where: {
          id: findUserEvent?.categoryId,
        },
      });

      const findEventLocation = await prisma.location.findFirst({
        where: {
          id: findUserEvent?.locationId,
        },
      });

      if (!findUserEvent) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
        });
      }

      const files = req.files as Express.Multer.File[];
      const imagePath =
        files.map((file) => `/assets/product/${file.filename}`) || [];

      const updateEvent = await prisma.event.update({
        data: {
          price: price ? Number(price) : findUserEvent.price,
          title: title ? title : findUserEvent.title,
          startTime: startTime
            ? new Date(startTime).toISOString()
            : findUserEvent.startTime,
          endTime: endTime
            ? new Date(endTime).toISOString()
            : findUserEvent.endTime,
          ticketType: ticketType ? ticketType : findUserEvent.ticketType,
          description: description ? description : findUserEvent.description,
          location: {
            update: {
              locationName: location
                ? location
                : findEventLocation?.locationName,
            },
          },
          category: {
            update: {
              categoryName: category
                ? category
                : findEventCategory?.categoryName,
            },
          },
          images: {
            create: imagePath.map((path) => ({ path })) || null,
          },
        },
        where: {
          id: findUserEvent.id,
        },
        include: {
          images: true,
        },
      });

      return res.status(200).send({
        success: true,
        message: 'Event updated successfull',
        result: updateEvent,
      });
    } catch (error) {
      next({
        success: false,
        message: 'Cannot update event',
        error,
      });
    }
  }

  async inactiveEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      if (res.locals.decrypt.id) {
        const findUserEvent = await prisma.event.findFirst({
          where: {
            id: Number(eventId),
            userId: res.locals.decrypt.id,
          },
        });

        if (!findUserEvent) {
          return res.status(404).send({
            success: false,
            message: 'Event not found',
          });
        }

        const inactiveEvent = await prisma.event.update({
          data: {
            isDeleted: true,
          },
          where: {
            id: findUserEvent.id,
          },
        });

        return res.status(200).send({
          success: true,
          message: 'event has been set to inactive',
          result: inactiveEvent,
        });
      }
    } catch (error) {
      console.log(error);
      next({ success: false, message: 'Cannot inactivate the event', error });
    }
  }

  async activateEvent(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      if (res.locals.decrypt.id) {
        const findUserEvent = await prisma.event.findFirst({
          where: {
            id: Number(eventId),
            userId: res.locals.decrypt.id,
          },
        });

        if (!findUserEvent) {
          return res.status(404).send({
            success: false,
            message: 'Event not found',
          });
        }

        const activateEvent = await prisma.event.update({
          data: {
            isDeleted: false,
          },
          where: {
            id: findUserEvent.id,
          },
        });

        return res.status(200).send({
          success: true,
          message: 'event has been set to inactive',
          result: activateEvent,
        });
      }
    } catch (error) {
      console.log(error);
      next({ success: false, message: 'Cannot inactivate the event', error });
    }
  }

  //ini detail event bisa utk user
  async getEventDetails(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;

      const findSpecificEvent = await prisma.event.findFirst({
        where: {
          id: Number(eventId),
        },
      });

      if (!findSpecificEvent) {
        return res.status(404).send({
          success: false,
          message: 'cannot find specific event',
        });
      }

      return res.status(200).send({
        success: true,
        result: findSpecificEvent,
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'Cannot get event details',
        error,
      });
    }
  }

  //ini event list utk pagination utk user
  async listEvents(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        page = 1,
        limit = 10,
        category,
        location,
        dateRange,
        search,
      } = req.query;

      //utk mengecek dateRange di query tulisnya 2024-01-01,2024-04-20
      let startTimeCondition;
      if (dateRange && Array.isArray(dateRange) && dateRange.length == 2) {
        const [startDate, endDate] = dateRange as string[];
        startTimeCondition = {
          gte: startDate,
          lte: endDate,
        };
      }

      let searchRes = {};

      if (search) {
        searchRes = {
          OR: [
            { title: { contains: String(search), mode: 'insensitive' } },
            { description: { contains: String(search), mode: 'insensitive' } },
          ],
          // The OR keyword in Prisma is used to create a condition where one or more of the sub-conditions must be true.
          // search either in the event's title or description.
          // contains is a Prisma filter that checks if a string includes the specified value.
          // String(search) ensures that the search term is treated as a string.
          // mode: 'insensitive' makes the search case-insensitive, it won't differentiate uppercase and lowercase.
        };
      }

      const getEventsLists = await prisma.event.findMany({
        where: {
          ...searchRes,
          category: category ? { categoryName: String(category) } : undefined,
          location: location ? { locationName: String(location) } : undefined,
          startTime: startTimeCondition,
          isDeleted: false,
        },
        include: {
          images: true,
          location: true,
          category: true,
        },
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
        // skip: (Number(page) - 1) * Number(limit): Calculates the number of records to skip based on the current page and limit (used for pagination).
        // take: Number(limit): Limits the number of records returned based on the provided limit.
      });

      const totalEvents = await prisma.event.count({
        // prisma.event.count  method to count the number of records in a model that match a given filter.
        where: {
          ...searchRes,
          category: category ? { categoryName: String(category) } : undefined,
          location: location ? { locationName: String(location) } : undefined,
          startTime: startTimeCondition,
          isDeleted: false,
        },
      });

      console.log(getEventsLists);

      return res.status(200).send({
        success: true,
        result: getEventsLists,
        total: totalEvents,
        page: Number(page),
        limit: Number(limit),
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'cannot get event list',
        error,
      });
    }
  }

  async getAnalytic(req: Request, res: Response, next: NextFunction) {}

  async addTestimonial(req: Request, res: Response, next: NextFunction) {
    try {
      const { eventId } = req.params;
      const { reviewDescription, rating } = req.body;

      const findEvent = await prisma.event.findFirst({
        where: {
          id: Number(eventId),
        },
      });

      if (!findEvent) {
        return res.status(404).send({
          success: false,
          message: 'Cannot find your event',
        });
      }

      const currentTime = new Date();
      if (currentTime < findEvent.startTime) {
        return res.status(400).send({
          success: false,
          message: 'The event is not started or ended yet',
        });
      }

      const findTransaction = await prisma.ticket.findFirst({
        where: {
          eventId: Number(eventId),
          userId: res.locals.decrypt.id,
          status: 'PAID',
        },
      });

      if (!findTransaction) {
        return res.status(403).send({
          success: false,
          message:
            'You can only leave a testimonial if you have purchased a ticket',
        });
      }

      const existTesti = await prisma.testimonial.findFirst({
        where: {
          eventId: Number(eventId),
          userId: res.locals.decrypt.id,
        },
      });

      if (existTesti) {
        return res.status(400).send({
          success: false,
          message: 'You have already left a testimonial',
        });
      }

      const createTesti = await prisma.testimonial.create({
        data: {
          userId: res.locals.decrypt.id,
          eventId: Number(eventId),
          reviewDescription,
          rating,
        },
      });

      return res.status(200).send({
        success: true,
        result: createTesti,
        message: 'Add testimonial success',
      });
    } catch (error) {
      console.log(error);
      next({
        success: false,
        message: 'cannot add testimonial',
        error,
      });
    }
  }

  // async deleteEvent(req: Request, res: Response, next: NextFunction) {
  //   try {
  //     if (res.locals.decrypt.id) {
  //       const findUser = await prisma.user.findUnique({
  //         where: {
  //           id: res.locals.decrypt.id,
  //         },
  //       });

  //       const findUserEvent = await prisma.event.findFirst({
  //         where: {
  //           userId: findUser?.id,
  //         },
  //       });

  //       const deleteEvent = await prisma.event.delete({
  //         where: {
  //           id: findUserEvent?.id,
  //         },
  //       });

  //       return res.status(200).send({
  //         success: true,
  //         message: 'Delete event succesfull',
  //         result: deleteEvent,
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     next({ success: false, message: 'Failed to delete your event', error });
  //   }
  // }
}
