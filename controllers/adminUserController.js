import userModel from "../models/userModel.js";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({
      deletedAt: null,
    });
    res.status(200).json({
      message: "Users fetched successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    res.status(200).json({
      message: "User fetched successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    console.log(req.body);

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.stripeCustomerId = req.body.stripeCustomerId || user.stripeCustomerId;
    user.isAdmin = req.body.isAdmin
      ? req.body.isAdmin == "1"
        ? true
        : false
      : user.isAdmin;

    await user.save();

    res.status(200).json({
      message: "User updated successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    user.deletedAt = new Date();

    await user.save();

    res.status(200).json({
      message: "User deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};
