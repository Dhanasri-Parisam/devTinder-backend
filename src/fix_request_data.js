const mongoose = require("mongoose");
const connectDB = require("./config/database");
const ConnectionRequest = require("./models/connectionRequest");

const requestId = "695b283f79cfed8bf4310712";
const newToUserId = "695befcd3dfc243da858da05"; // Hulk

const run = async () => {
    try {
        await connectDB();

        const request = await ConnectionRequest.findById(requestId);
        if (request) {
            console.log(`Updating request ${requestId}...`);
            console.log(`Old toUserId: ${request.toUserId}`);

            request.toUserId = newToUserId;
            // Ensure status is interested so it can be accepted
            request.status = "interested";

            await request.save();
            console.log(`New toUserId: ${request.toUserId}`);
            console.log("Update Successful");
        } else {
            console.log("Request not found");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
