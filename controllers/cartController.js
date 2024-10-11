import userModel from "../models/userModel.js";

// Add to cart
const addToCart = async (req, res) => {
  try {
    let user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    }

    const cartItem = {
      food: req.body.food,
      quantity: req.body.quantity,
    };

    let cartData = await user.cartData;

    if (!cartData[req.body.itemId]) cartData[req.body.itemId] = 1;
    else cartData[req.body.itemId] += 1;

    user = await userModel.findByIdAndUpdate(user._id, user);

    res.json({
      message: "Item added to cart",
      success: true,
      data: user.cartData,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Remove from cart
const removeFromCart = async (req, res) => {
  try {
    let user = await userModel.findById(req.user.id);

    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    }

    const cartData = await user.cartData;

    if (!cartData[req.body.itemId]) {
      return res.json({
        message: "Item not found in cart",
        success: false,
      });
    }

    delete cartData[req.body.itemId];

    // else if (cartData[req.body.itemId] === 1) {
    //   delete cartData[req.body.itemId];
    // } else {
    //   cartData[req.body.itemId] -= 1;
    // }

    await userModel.findByIdAndUpdate(user._id, {
      cartData,
    });

    res.json({
      message: "Item removed from cart",
      success: true,
      cartData,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

// Get user cart
const getUserCart = async (req, res) => {
  try {
    const user = await userModel.findById(req.user.id).populate("cartData");

    if (!user) {
      return res.json({
        message: "User not found",
        success: false,
      });
    }

    res.json({
      message: "Cart fetched successfully",
      success: true,
      data: user.cartData,
    });
  } catch (error) {
    res.json({ message: error.message, success: false });
  }
};

export { addToCart, removeFromCart, getUserCart };
