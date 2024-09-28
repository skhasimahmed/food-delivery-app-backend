import foodModel from "../models/foodModel.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

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
      const oldImagePath = path.join(__dirname, `../uploads/${food.image}`);

      // Check if the old file exists before attempting to delete
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      // fs.unlinkSync(`./uploads/${food.image}`);
      food.image = req.file.filename;
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

    fs.unlinkSync(`./uploads/${food.image}`);

    await foodModel.findByIdAndDelete(req.params.id);

    res.json({
      message: "Food deleted successfully",
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

export { addFood, getFood, listFood, editFood, deleteFood };
