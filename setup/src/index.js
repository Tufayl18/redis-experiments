import express from "express";
import Redis from "ioredis";
import mongoose from "mongoose";

const app = express();
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

app.get("/redis", async (req, res) => {
  try {
    const value = await redis.ping();
    res.json({ message: `Redis is running: ${value}` });
  } catch (error) {
    res.status(500).json({ error: `Redis error: ${error.message}` });
  }
});

app.get("/mongodb", async (req, res) => {
  try {
    const url = process.env.MONGO_URL || "mongodb://localhost:27017/redis_db";
    await mongoose.connect(url);
    res.json({ message: "MongoDB is connected", database: mongoose.connection.name });
  } catch (error) {
    res.status(500).json({ error: `MongoDB error: ${error.message}` });
  }
}); 

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});