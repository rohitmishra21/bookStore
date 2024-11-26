const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./userAuth");
//Sign Up

router.post("/sign-up", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;

    //check username length is more than 3

    if (username.length < 3) {
      return res
        .status(500)
        .json({ message: "user name length should be greater than 3✌️" });
    }

    //chek user name is already exist

    const existingUsername = await User.findOne({ username: username });

    if (existingUsername) {
      return res
        .status(500)
        .json({ message: "user name hai is already exist. ✌️" });
    }

    //chek user name is already exist

    const existingEmail = await User.findOne({ email: email });

    if (existingEmail) {
      return res.status(500).json({ message: "Email is already exist. ✌️" });
    }

    //chek user password length should be greater than 6.

    if (password.length < 5) {
      return res
        .status(500)
        .json({ message: "Password length should be grater thn 5. ✌️" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: hashPassword,
      address: address,
    });

    await newUser.save();

    await newUser.save();
    return res.status(200).json({ message: "User added successfully" }); // `return` added
  } catch (error) {
    return res.status(500).json({ message: "internal server error" }); // `return` added
  }
});

//Sign in

router.post("/sign-in", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUsername = await User.findOne({ username });

    if (!existingUsername) {
      return res.status(500).json({ message: "invalid credentials" });
    }

    await bcrypt.compare(password, existingUsername.password, (err, data) => {
      if (data) {
        const authClamis = [
          { name: existingUsername.username },
          { role: existingUsername.role },
        ];
        const token = jwt.sign({ authClamis }, "book123", { expiresIn: "30d" });
        res.status(200).json({
          id: existingUsername._id,
          role: existingUsername.role,
          token: token,
        });
      } else {
        res.status(500).json({ message: "invalid credentials" });
      }
    });
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

//get-user-info

router.get("/get-user-info", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: "internal server error" });
  }
});

//update-address

router.put("/update-address", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json("address is update successfully");
  } catch (error) {
      res.status(500).json({ error: error.message });
    }
});

//update-img

router.put("/update-img", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { avtar } = req.body;
    await User.findByIdAndUpdate(id, { avtar: avtar });
    return res.status(200).json("img is update successfully");
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
