const router = require("express").Router();
const Book = require("../models/book");
const order = require("../models/order");
const Order = require("../models/order");
const user = require("../models/user");
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;
    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      //saving order in user model

      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      //clearing chat from db

      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.json({
      status: "success",
      message: "order placed successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// get order history of a perticular user

router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    const orderData = userData.orders.reverse();
    return res.json({
      status: "Success",
      data: orderData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//update-order ---admin

router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });
    return res.json({
      status: "Success",
      message: "status Updated Successfully",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});
//get-all-order ---admin

router.get("/get-all-orders", authenticateToken, async (req, res) => {
  try {
    const userData = await order
      .find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });
    return res.json({
      status: "success",
      data: userData,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
