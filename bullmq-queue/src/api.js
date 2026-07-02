import express from 'express';
import { Queue, Worker } from 'bullmq';
import { emailQueue, connection } from './queue.js';
import IORedis from 'ioredis';

const app = express();
app.use(express.json());

app.post("/welcome-email", async (req, res) => {
    const job = emailQueue.add
    ("welcome-email", 
        {
            to: req.body.to,
            subject: req.body.subject || "Welcome!",
            body: req.body.body || "Welcome to our service!",
            createdAt: new Date().toISOString()
        },
        {
            attempts: 3, // Number of retry attempts
            backoff: {
                type: 'exponential', // Backoff strategy
                delay: 1000 // Initial delay in milliseconds
            }
        }
    );
    res.json({queued: true, job, message: "Job added to the queue. It will be processed by the worker."});
});
