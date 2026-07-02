import { Worker } from "bullmq";
import { connection } from "./queue.js";


const emailWorker = new Worker("emails", async (job) => {
    console.log("Worker is processing jobs...", job.id, job.name, job.data)
    await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate job processing
    console.log("Job completed", job.id)
    },
    {connection}
)

emailWorker.on("completed", (job) => {
    console.log(`Job ${job.id} has been completed`);
});

emailWorker.on("failed", (job, err) => {
    console.log(`Job ${job.id} has failed with error: ${err.message}`);
});