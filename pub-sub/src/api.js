import express from 'express';
import IORedis from 'ioredis';

const app = express();
app.use(express.json());

const publisher = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379');


app.post("/notification", async (req, res) => {
   const payload = {
    title: req.body.title || "Default Title",
    message: req.body.message || "Default Message",
    createdAt: new Date().toISOString()
   };
   try {
       await publisher.publish("notification", JSON.stringify(payload));
       res.status(200).json({ status: "Message published successfully" });
   } catch (error) {
       console.error("Failed to publish message:", error);
       res.status(500).json({ error: "Failed to publish message" });
   }
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`Server is running on port ${process.env.PORT || 3000}`);
});
