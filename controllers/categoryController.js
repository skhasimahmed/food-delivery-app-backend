import categoryModel from "../models/categoryModel.js";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { cloudinary } from "../configs/cloudinary.js";

// List all categories
export const listCategories = async (req, res) => {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      data: categories,
      message: "Categories fetched successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
      success: false,
    });
  }
};

// Add category
export const addCategory = async (req, res) => {
  const image = req.file.filename;
  const { name, description } = req.body;

  const newCategory = new categoryModel({ image, name, description });

  try {
    await newCategory.save();
    res.json({
      message: "Category added successfully",
      category: newCategory,
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// get category
export const getCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);
    res.json({
      success: true,
      data: category,
      message: "Category fetched successfully", // Add this line
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Edit category
export const updateCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.json({
        message: "Category not found",
        success: false,
      });
    }

    if (req.file) {
      const oldImagePublicId = category.image.split(".")[0];

      await cloudinary.uploader.destroy(oldImagePublicId, (error, result) => {
        if (error) {
          return res.status(500).json({
            message: "Failed to delete the old image",
            success: false,
          });
        }
      });
      const image = req.file.filename;
      category.image = image;
    }

    category.name = req.body.name;
    category.description = req.body.description;

    await category.save();

    res.json({
      message: "Category updated successfully",
      success: true,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  try {
    const category = await categoryModel.findById(req.params.id);

    if (!category) {
      return res.json({
        message: "Category not found",
        success: false,
      });
    }

    const oldImagePublicId = category.image.split(".")[0];

    await cloudinary.uploader.destroy(oldImagePublicId, (error, result) => {
      if (error) {
        return res.status(500).json({
          message: "Failed to delete the old image",
          success: false,
        });
      } else {
        categoryModel
          .findByIdAndDelete(req.params.id)
          .then(() => {
            res.json({
              message: "Category deleted successfully",
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
