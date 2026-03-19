import Stripe from 'stripe';
import Course from '../models/Course.js';
import User from '../models/User.js';
import Progress from '../models/Progress.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: course.title,
              description: course.description,
              images: [course.thumbnail],
            },
            unit_amount: Math.round(course.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/courses/${course.slug}`,
      metadata: { courseId: courseId.toString(), userId: req.user._id.toString() },
    });

    res.json({ url: session.url });
  } catch (err) {
    next(err);
  }
};

export const stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { courseId, userId } = session.metadata;

    await User.findByIdAndUpdate(userId, {
      $addToSet: {
        purchasedCourses: courseId,
        enrolledCourses: { courseId },
      },
    });
    await Course.findByIdAndUpdate(courseId, { $inc: { enrollmentCount: 1 } });
    await Progress.findOneAndUpdate(
      { studentId: userId, courseId },
      { studentId: userId, courseId },
      { upsert: true }
    );
  }

  res.json({ received: true });
};
