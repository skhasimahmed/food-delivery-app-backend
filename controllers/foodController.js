import foodModel from "../models/foodModel.js";
import fs from "fs";

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

export { addFood, listFood, deleteFood };
