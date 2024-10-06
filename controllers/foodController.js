import foodModel from "../models/foodModel.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { cloudinary } from "../configs/cloudinary.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Get food item
const getFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);
    res.json({
      success: true,
      data: food,
      message: "Food fetched successfully",
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Add food item
const addFood = async (req, res) => {
  const imageFileName = req.file.filename;

  const food = req.body;

  const newFood = new foodModel({
    name: food.name,
    price: food.price,
    description: food.description,
    category: food.category,
    image: imageFileName,
  });

  try {
    await newFood.save();
    res.json({
      message: "Food added successfully",
      food: newFood,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Get all foods
const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({
      success: true,
      data: foods,
      message: "Foods fetched successfully",
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Edit food item
const editFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);

    if (!food) {
      return res.json({
        message: "Food not found",
        success: false,
      });
    }

    if (req.file) {
      const oldImagePublicId = food.image.split(".")[0];

      await cloudinary.uploader.destroy(oldImagePublicId, (error, result) => {
        if (error) {
          return res.status(500).json({
            message: "Failed to delete the old image",
            success: false,
          });
        }
      });

      const extension = path.extname(req.file.originalname);

      food.image = req.file.filename + extension;
    }

    food.name = req.body.name;
    food.price = req.body.price;
    food.description = req.body.description;
    food.category = req.body.category;

    await food.save();

    res.json({
      message: "Food updated successfully",
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Delete food item
const deleteFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.params.id);

    if (!food) {
      return res.json({
        message: "Food not found",
        success: false,
      });
    }

    const oldImagePublicId = food.image.split(".")[0];

    await cloudinary.uploader.destroy(oldImagePublicId, (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to delete the old image",
          success: false,
        });
      } else {
        foodModel
          .findByIdAndDelete(req.params.id)
          .then(() => {
            res.json({
              message: "Food deleted successfully",
              success: true,
            });
          })
          .catch((error) => {
            res.json({ message: error.message, success: false });
          });
      }
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

export { addFood, getFood, listFood, editFood, deleteFood };
