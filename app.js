const express = require("express");
const app = express();

require("dotenv").config();
require("./conections/connection");
const cors = require("cors");
const user = require("./routes/user");
const Book = require("./routes/book");
const favourite = require("./routes/favourite");
const cart = require("./routes/cart");
const order = require("./routes/order");
app.use(cors())
app.use(express.json());

//routes

app.use("/api", user);
app.use("/api", Book);
app.use("/api", favourite);
app.use("/api", cart);
app.use("/api", order);

//creating port
app.listen(process.env.PORT, () => {
  console.log(`server is run in port number ${process.env.PORT}`);
});
