const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//add book to cart

router.put("/add-book-to-cart", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isCart = userData.cart.includes(bookid);
    if (isCart) {
      res.status(200).json({ message: "book is already is in your cart ❤️" });
    }
    await User.findByIdAndUpdate(id, { $push: { cart: bookid } });
    return res.status(200).json({ message: "book  is added in your cart ❤️" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

//remove book to cart

router.put(
  "/remove-book-to-cart/:bookid",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid } = req.params;
      const { id } = req.headers;
      const userData = await User.findById(id);
      const isCart = userData.cart.includes(bookid);
      if (isCart) {
        await User.findByIdAndUpdate(id, { $pull: { cart: bookid } });
      }

      // Ensure only one response is sent
      return res.status(200).json({ message: "Book removed from your cart ❤️" });
    } catch (error) {
      if (!res.headersSent) { // Check if response headers are already sent
        return res.status(500).json({ message: "Internal server error", error: error.message });
      }
    }
  }
);


//get  book to cart for perticular user

router.get("/get-book-to-cart", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("cart");
    const usercart = userData.cart.reverse();

    return res.json({ status: "success", data: usercart });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

module.exports = router;
