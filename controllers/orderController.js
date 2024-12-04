import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import paymentModel from "../models/paymentModel.js";
import Stripe from "stripe";
import { populate } from "dotenv";

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

// Get payment info by order id
const getAllOrders = async (req, res) => {
  try {
    const {orderUserId} = req.query;
    const filter = {
      deletedAt: null
    };
    if(orderUserId?.length > 0) {
      filter.userId = orderUserId;
    }
    
    const orders = await orderModel.find(filter).populate("userId").sort({createdAt: -1});
    
    res.status(200).json({
      message: "Orders fetched successfully",
      success: true,
      data: orders,
    });

  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Get Total Revenue
const getTotalRevenue = async (req, res) => {
  try {
    const revenue = await paymentModel.aggregate([{ $match: { chargeStatus: "paid" } }, { $group: {_id : null, totalRevenue: { $sum: "$amount" } } }]);

    res.json({
      success: true,
      revenue: revenue[0].totalRevenue
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Something went wrong. Please try again.",
    });
  }
};

// Change order status
const changeOrderStatus = async (req, res) => {  
  try {
    const order = await orderModel.findById(req.body.id);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        success: false,
      });
    }

    order.status = req.body.status || order.status;

    await order.save();

    res.status(200).json({
      message: "Order status is changed successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

export { placeOrder, paymentInfo, getAllOrders, getTotalRevenue, changeOrderStatus };
