// backend/config/db.js

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // We use process.env.MONGO_URI so we can keep our connection string secret
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // Exit the process with failure
    process.exit(1);
  }
};

module.exports = connectDB;