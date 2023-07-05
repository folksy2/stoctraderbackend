const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
require("colors");
const connectDB = require("./dbinit");
const userRoutes = require("./routes/user");
const stockInfoRoutes = require("./routes/stockInfo");

connectDB();

const Port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/user", userRoutes);
app.use("/stockinfo", stockInfoRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the server");
});

app.get('/product/:itemId', async function(req, res) {
  const itemId = req.params.itemId;

  // Fetch product from the database using the itemId
  try {
     
      const Product = await product.findById(itemId);

      if (!Product) {
          return res.status(404).json({ message: "Product not found" });
      }

      res.json(Product);
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server Error" });
  }
});


app.listen(Port, () => {
  console.log(`Server is running on port ${Port}`.black.bgWhite);
});
