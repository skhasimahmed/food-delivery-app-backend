import Stripe from "stripe";
import paymentModel from "../models/paymentModel.js";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const stripeWebhook = async (request, response) => {
  const signature = request.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      request.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed.`, err.message);

    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    // Customer events
    case "customer.created":
      const customerCreated = event.data.object;
      // Then define and call a function to handle the event customer.created
      break;
    case "customer.deleted":
      const customerDeleted = event.data.object;
      // Then define and call a function to handle the event customer.deleted
      break;
    case "customer.updated":
      const customerUpdated = event.data.object;
      // Then define and call a function to handle the event customer.updated
      break;

    // Charge events
    case "charge.expired":
      const chargeExpired = event.data.object;

      // Handle charge.expired event here on expired charge

      break;
    case "charge.failed":
      const chargeFailed = event.data.object;

      // Handle charge.failed event here on failed charge
      break;
    case "charge.pending":
      const chargePending = event.data.object;

      // Handle charge.pending event here on pending charge

      break;
    case "charge.succeeded":
      const chargeSucceeded = event.data.object;

      // Handle charge.succeeded event here on successful charge

      break;

    // Payment intent events
    case "payment_intent.canceled":
      const paymentIntentCanceled = event.data.object;

      // Handle payment_intent.canceled event here on canceled payment
      // Failed payment
      console.log("paymentIntentCanceled", paymentIntentCanceled);

      break;
    case "payment_intent.created":
      const paymentIntentCreated = event.data.object;
      break;
    case "payment_intent.payment_failed":
      const paymentIntentPaymentFailed = event.data.object;

      // Handle payment_intent.payment_failed event here on failed payment
      // Failed payment
      console.log("paymentIntentPaymentFailed", paymentIntentPaymentFailed);

      break;
    case "payment_intent.succeeded":
      const paymentIntentSucceeded = event.data.object;

      // Handle payment_intent.succeeded event here on successful payment
      // Successful payment

      break;

    // Checkout Session events
    case "checkout.session.completed":
      const checkoutSessionCompleted = event.data.object;
      // Handle checkout.session.completed event here on successful payment
      // Successful payment

      // console.log("checkoutSessionCompleted", checkoutSessionCompleted);

      // get order id from checkout session
      const orderId = checkoutSessionCompleted.metadata.orderId;

      // get user id from checkout session
      const userId = checkoutSessionCompleted.metadata.userId;

      // get payment status from checkout session
      const paymentStatus = checkoutSessionCompleted.payment_status;

      // get charge status from payment intent
      const chargeStatus = paymentStatus;

      // get payment intent from checkout session
      const paymentIntent = await stripe.paymentIntents.retrieve(
        checkoutSessionCompleted.payment_intent
      );

      // get payment intent id from payment intent
      const paymentIntentId = paymentIntent.id;

      // get payment method id from payment intent
      const paymentMethodId = paymentIntent.payment_method;

      // get charge id from payment intent
      const chargeId = paymentIntent.latest_charge;

      // get payment amount from payment intent
      const amount = paymentIntent.amount / 100;

      // get status from payment intent
      const status = paymentIntent.status;

      // checkout session status
      const statusCheckout = checkoutSessionCompleted.status;

      await paymentModel.findOneAndUpdate(
        { orderId: orderId, userId: userId },
        {
          amount,
          paymentIntentId,
          paymentMethodId,
          status,
          chargeId,
          chargeStatus,
        }
      );

      await orderModel.findOneAndUpdate(
        { _id: orderId },
        {
          status: "processing",
          paymentStatus,
        }
      );

      // console.log("checkoutSessionCompleted", checkoutSessionCompleted);

      if (
        paymentStatus == "paid" &&
        status == "succeeded" &&
        statusCheckout == "complete"
      ) {
        await userModel.findByIdAndUpdate(userId, {
          cartData: {},
        });
      }

      break;
    case "checkout.session.expired":
      const checkoutSessionExpired = event.data.object;

      // Handle checkout.session.expired event here when session expires
      // Failed payment
      console.log("checkoutSessionExpired", checkoutSessionExpired);

      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  response.send();
};

export { stripeWebhook };
