const mongoose = require("mongoose");
const connectDB = require("./config/database");
const ConnectionRequest = require("./models/connectionRequest");
const fs = require("fs");
const path = require("path");

const requestId = "695b283f79cfed8bf4310712";

const run = async () => {
    try {
        await connectDB();

        const request = await ConnectionRequest.findById(requestId);
        let result = {};
        if (request) {
            result = {
                id: request._id,
                status: request.status,
                fromUserId: request.fromUserId,
                toUserId: request.toUserId
            };
        } else {
            result = { message: "REQUEST_NOT_FOUND" };
        }

        fs.writeFileSync(path.join(__dirname, "debug_output.json"), JSON.stringify(result, null, 2));

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
