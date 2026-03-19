import express from 'express';
import { createCheckoutSession, stripeWebhook } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();
router.post('/webhook', express.raw({ type: 'application/json' }), stripeWebhook);
router.use(protect);
router.post('/checkout', createCheckoutSession);

export default router;
