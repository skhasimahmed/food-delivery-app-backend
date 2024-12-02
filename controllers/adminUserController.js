import { cloudinary } from "../configs/cloudinary.js";
import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";

export const getAllUsers = async (req, res) => {
  try {
    const users = await userModel.find({
      deletedAt: null,
    }).sort({createdAt: -1});
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

export const updateProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }

    if(req.file) {
      const oldImagePublicId = user.image?.split(".")[0];
      if(oldImagePublicId) {
        await cloudinary.uploader.destroy(oldImagePublicId, (error, result) => {
          if (error) {
            return res.status(500).json({
              message: "Failed to delete the old image",
              success: false,
            });
          }
        });
      }
    }

    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.image = req.file?.filename || user.image;

    await user.save();

    res.status(200).json({
      message: "Your profile is updated successfully",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
        image: user.image
      },
      success: true,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
}

  export const changePassword = async (req, res) => {    
    try {      
      const user = await userModel.findById(req.params.id);
      if (!user) {
        return res.status(404).json({
          message: "User not found",
          success: false,
        });
      }

      const isMatch = await bcrypt.compare(req.body.currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(404)
          .json({ success: false, message: "Current password is not match!" });
      }

      if (req.body.newPassword.length < 8) {
        return res.status(404).json({
          success: false,
          message: "New Password length is too short. Must be at least 8 characters.",
        });
      }

      if (req.body.newPassword !== req.body.confirmNewPassword) {
        return res
          .status(404)
          .json({ success: false, message: "Please confirm new password!" });
      }

      const isNewPasswordMatch = await bcrypt.compare(req.body.newPassword, user.password);
      if (isNewPasswordMatch) {
        return res
          .status(404)
          .json({ success: false, message: "New password should not match with old password!" });
      }

      const salt = await bcrypt.genSalt(12);

      const hashedPassword = await bcrypt.hash(req.body.newPassword, salt);

      user.password = hashedPassword || user.password;
      await user.save();

      res.status(200).json({
        message: "Password changed successfully. Please login with new password",
        success: true,
      });
    } catch (error) {
      res.status(500).json({
        message: error.message,
        success: false,
      });
    }
  }
