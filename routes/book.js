const router = require("express").Router();
const User = require("../models/user");
const Book = require("../models/book");
const { authenticateToken } = require("./userAuth");

//added book by admin only

router.post("/add-book", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const user = await User.findById(id);

    if (user.role !== "admin") {
      res
        .status(500)
        .json({ message: "you are not admin its only for admin." });
    }
    const book = new Book({
      url: req.body.url,
      author: req.body.author,
      price: req.body.price,
      decs: req.body.decs,
      language: req.body.language,
    });
    await book.save();

    res.status(200).json({ message: "book maked sucessfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//update book

router.put("/update-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndUpdate(bookid, {
      url: req.body.url,
      author: req.body.author,
      price: req.body.price,
      decs: req.body.decs,
      language: req.body.language,
    });
    return res.status(200).json({
      message: "book update successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "internal error" });
  }
});

//delete-book

router.delete("/delete-book", authenticateToken, async (req, res) => {
  try {
    const { bookid } = req.headers;
    await Book.findByIdAndDelete(bookid);
    return res.status(200).json({
      message: "book deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: "internal error" });
  }
});

// Get-recently added book limit-1

router.get("/get-recentlyAdded-book", async (req, res) => {
  try {
    const books = await Book.find()
      .sort({
        createdAt: -1,
      })
      .limit(4);
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: "internal error" });
  }
});

// allbooks show

router.get("/all-book", async (req, res) => {
  try {
    const books = await Book.find().sort({
      createdAt: -1,
    });
    return res.json({
      status: "Success",
      data: books,
    });
  } catch (error) {
    res.status(500).json({ message: "internal error" });
  }
});

//book-details

router.get("/book-detail/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "success",
      data: book,
    });
  } catch (error) {
    console.log("error");
    return res.status(500).json({ message: "dedtail does not show" });
  }
});

module.exports = router;
