const router = require("express").Router();
const User = require("../models/user");
const { authenticateToken } = require("./userAuth");

//add book to favourite
router.put("/add-book-to-favourite", authenticateToken, async (req, res) => {
  try {
    const { bookid, id } = req.headers;
    const userData = await User.findById(id);
    const isFavourite = userData.favourites.includes(bookid);
    if (isFavourite) {
      return res.status(200).json({ message: "book is already in favorite" });
    }
    await User.findByIdAndUpdate(id, { $push: { favourites: bookid } });
    return res.status(200).json({ message: "book is added in favorite" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// book remove from to favourite
router.put(
  "/remove-book-from-favourite",
  authenticateToken,
  async (req, res) => {
    try {
      const { bookid, id } = req.headers;
      const userData = await User.findById(id);
      const isFavourite = userData.favourites.includes(bookid);
      if (isFavourite) {
        await User.findByIdAndUpdate(id, { $pull: { favourites: bookid } });
      }
      return res.status(200).json({ message: "book is removed from favorite" });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

//get favourite book for a perticular user

router.get("/get-favourite-books", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const userData = await User.findById(id).populate("favourites");
    const favouriteBooks = userData.favourites;
    return res.json({
      status: "success",
      data: favouriteBooks,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
