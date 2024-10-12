import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import paymentModel from "../models/paymentModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Placing user order
const placeOrder = async (req, res) => {
  try {
    const newOrder = new orderModel({
      userId: req.user.id,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();

    const successUrl =
      process.env.CLIENT_PAYMENT_CONFIRMATION_URL +
      "?success=true&orderId=" +
      newOrder._id;

    const cancelUrl =
      process.env.CLIENT_PAYMENT_CONFIRMATION_URL +
      "?success=false&orderId=" +
      newOrder._id;

    const lineItems = req.body.items.map((item) => {
      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.name,
          },
          unit_amount: item.price * 100,
        },
        quantity: item.quantity,
      };
    });

    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charge",
        },
        unit_amount: req.body.deliveryCharge * 100,
      },
      quantity: 1,
    });

    // Create customer in Stripe
    const user = await userModel.findById(req.user.id);

    if (user && !user.stripeCustomerId) {
      const stripeCustomer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        description: "Foodzie Customer",
      });

      user.stripeCustomerId = stripeCustomer.id;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        orderId: newOrder._id.toString(),
        userId: req.user.id.toString(),
        // customerId: user.stripeCustomerId,
      },
      customer_email: user.email,
    });

    await paymentModel.create({
      orderId: newOrder._id.toString(),
      userId: req.user.id.toString(),
      amount: req.body.amount,
    });

    res.json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong. Please try again.",
      // message: error.message,
    });
  }
};

// Get payment info by order id
const paymentInfo = async (req, res) => {
  try {
    const payment = await paymentModel.findOne({
      orderId: req.query.orderId,
      userId: req.user.id,
    });

    if (!payment) {
      return res.json({
        success: false,
        message: "Order not found",
      });
    }

    res.json({
      success: true,
      data: payment,
      message: "Payment info fetched successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { placeOrder, paymentInfo };
