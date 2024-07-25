const cron = require("node-cron");
const { fetchEvents } = require("../../listener");

const startJob = async () => {
    try {
        console.log("Cron job started")
        await fetchEvents();
    } catch (error) {
        console.error("Error occurred in running the job: ", error);
    }
};

// startJob();

cron.schedule("*/5 * * * *", startJob, {
    scheduled: true,
    timezone: "UTC",
});
