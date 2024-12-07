import foodModel from "../models/foodModel.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { cloudinary } from "../configs/cloudinary.js";
import { log } from "console";

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
    const { search, page, limit, category, priceShort } = req.query;

    let filter = {};
    let query = [];
    const skip = (parseInt(page) - 1) * parseInt(limit);
    if (category && category != "All") {
      const regexCategory = new RegExp(category, "i");
      filter.category = regexCategory;
    }
    let totalFoods = await foodModel.countDocuments(filter);
    let totalPages = Math.ceil(totalFoods / parseInt(limit));
    let foods = await foodModel
      .find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });
    if (search && search.length > 0) {
      // Perform a case-insensitive 'like' search using a regular expression
      const regexText = new RegExp(search, "i"); // 'i' for case-insensitive

      query = [
        { name: { $regex: regexText } },
        { description: { $regex: regexText } },
        { category: { $regex: regexText } },
      ];
      foods = await foodModel
        .find({
          $and: [filter, { $or: query }],
        })
        .skip(skip)
        .limit(parseInt(limit))
        .sort({ createdAt: -1 });

      totalFoods = await foodModel.countDocuments({
        $and: [filter, { $or: query }],
      });
      totalPages = Math.ceil(totalFoods / parseInt(limit));
    }

    if (priceShort === "lowToHigh") {
      foods = foods.sort((a, b) => a.price - b.price);
    } else if (priceShort === "highToLow") {
      foods = foods.sort((a, b) => b.price - a.price);
    }
    res.json({
      success: true,
      data: foods,
      totalFoods,
      totalPages,
      message: "Foods fetched successfully",
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Edit food item
const updateFood = async (req, res) => {
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

export { addFood, getFood, listFood, updateFood, deleteFood };
