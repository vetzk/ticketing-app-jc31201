import express from 'express';
import { createPayment, getPayment, getPayments } from '@/controllers/payment.controler';

const router = express.Router();

// Routes for payments
router.post('/', createPayment);
router.get('/', getPayments);
router.get('/:id', getPayment);

export default router;
