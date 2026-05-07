require("dotenv").config();
const mongoose = require("mongoose");
const { connectDB } = require("../config/db");
const Topic = require("../models/Topic");
const data = require("./seedData");

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);
    await Topic.deleteMany({});
    await Topic.insertMany(data);
    console.log(`Seeded ${data.length} topics.`);
  } catch (err) {
    console.error("Seed failed:", err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
