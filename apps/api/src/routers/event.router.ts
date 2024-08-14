import express from 'express';
import { createEvent, getEvent, gettingEvents, updateEvent, deleteEvent, getEventByTitle } from '@/controllers/event.controller';

const router = express.Router();

// Routes for events
router.post('/', createEvent);
router.get('/', getEvent); // Handles search by title
router.get('/:title', getEventByTitle); // Fetch by title
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
