import express from 'express';
import { createEvent, getEvent, getEvents, updateEvent, deleteEvent } from '@/controllers/event.controler';

const router = express.Router();

// Routes for events
router.post('/', createEvent);
router.get('/', getEvents);
router.get('/:id', getEvent);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
