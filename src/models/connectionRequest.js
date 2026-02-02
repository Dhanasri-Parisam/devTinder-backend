const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref : "User",
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: [
                "ignore",
                "interested",
                "accepted",
                "ignored",
                "blocked",
                "pending",
            ],
            message: "{VALUE} is not a valid status",
        },
    },
}, {
    timestamps: true
})

connectionRequestSchema.pre("save", async function () {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        // <--- throw Error instead
        // No next() call needed; resolving the promise signals success
        throw new Error("You cannot send connection request to yourself");
    }
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;