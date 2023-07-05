
const mongoose = require("mongoose");

// Connect to MongoDB

const connectDB = async () => {
  const conn = await mongoose.connect(process.env.MONGO_URI);
  console.log(`MongoDB Connected: ${conn.connection.name}`.cyan.underline.bold);
};

module.exports = connectDB;
