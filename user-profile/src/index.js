import express from "express";
import Redis from "ioredis";

const app = express();
app.use(express.json());
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");


app.post("/user/:id/hash", async (req, res) => {
  await redis.hset(`user:${req.params.id}:hash`, req.body);
  res.json({ success: true, message: "Hash set successfully" });
})

app.get("/user/:id/hash", async(req, res) => {
  const user = await redis.hgetall(`user:${req.params.id}:hash`)
  console.log(typeof user)
  res.json({ success: true, message: "Hash retrieved successfully", user : user });
})



app.listen(3000, () => {
  console.log("Server is running on port 3000");
});