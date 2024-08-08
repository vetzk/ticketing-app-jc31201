import { EventController } from '@/controllers/event.controller';
import { uploader } from '@/middleware/uploader';
import { verifyToken } from '@/middleware/verifyToken';
import { Router } from 'express';

export class EventRouter {
  private router: Router;
  private eventController: EventController;

  constructor() {
    this.router = Router();
    this.eventController = new EventController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    //Used bind to ensure that "this" inside getEvent, addEvent, and updateEvent points to the EventController instance.
    //When you pass a method as a callback, "this" value may get lost.
    //Using .bind(this.eventController) ensures that the method retains the correct this context when it's called by Express.
    this.router.get(
      '/get-event',
      verifyToken,
      this.eventController.getEvent.bind(this.eventController),
    );
    this.router.post(
      '/add-event',
      verifyToken,
      uploader('/product', 'EVE').array('eve', 3),
      this.eventController.addEvent.bind(this.eventController),
    );
    this.router.patch(
      '/update-event/:eventId',
      verifyToken,
      uploader('/product', 'EVE').array('eve', 3),
      this.eventController.updateEvent.bind(this.eventController),
    );

    this.router.patch(
      '/inactive-event/:eventId',
      verifyToken,
      this.eventController.inactiveEvent,
    );
    this.router.patch(
      '/activate-event/:eventId',
      verifyToken,
      this.eventController.activateEvent,
    );
    this.router.get(
      '/list-events',
      this.eventController.listEvents.bind(this.eventController),
    );

    // this.router.delete(
    //   '/delete-event',
    //   verifyToken,
    //   this.eventController.deleteEvent,
    // );
  }

  getRouter(): Router {
    return this.router;
  }
}
