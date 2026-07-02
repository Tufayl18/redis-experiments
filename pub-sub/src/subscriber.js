import Redis from "ioredis";

const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

subscriber.subscribe("notification", (err) => {
    if (err) {
        console.error("Failed to subscribe: %s", err.message);
    } else {
        console.log(`Subscribed successfully!`);
    }
});

subscriber.on("message", (channel, message) => {
    console.log("Recieved on", channel, ":", JSON.parse(message));
});

