import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// Login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });

    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = createToken(user);

    res.json({
      success: true,
      message: "Login successful",
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      isAdmin: user.isAdmin ?? false,
      cartData: user.cartData,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Register user
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await userModel.findOne({ email });

    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ success: false, message: "Invalid email" });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password length is too short. Must be at least 8 characters.",
      });
    }

    // if (!validator.isStrongPassword(password)) {
    //   return res
    //     .status(400)
    //     .json({ success: false, message: "Password not strong enough" });
    // }

    const salt = await bcrypt.genSalt(12);

    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = createToken(user);

    res.status(201).json({
      success: true,
      message: "Registration successful",
      cartData: user.cartData,
      user: {
        userId: user._id,
        name: user.name,
        email: user.email,
      },
      isAdmin: user.isAdmin ?? false,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

const createToken = (user) => {
  return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

export { loginUser, registerUser };
