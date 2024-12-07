import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import paymentModel from "../models/paymentModel.js";

// Get payment info by order id
const getAllChartsData = async (req, res) => {
  try {
    const users = await userModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalUsers: { $sum: 1 },
        },
      },
    ]);

    const orders = await orderModel.aggregate([
      {
        $match: {
          deletedAt: null,
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalOrder: { $sum: 1 },
        },
      },
    ]);

    const revenue = await paymentModel.aggregate([
      {
        $match: {
          deletedAt: null,
          chargeStatus: "paid",
        },
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          totalRevenue: { $sum: { $toInt: "$amount" } },
        },
      },
    ]);

    res.json({
      success: true,
      users,
      orders,
      revenue,
      message: "Charts info fetched successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      message: error.message,
    });
  }
};

export { getAllChartsData };
