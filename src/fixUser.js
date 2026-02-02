const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./models/user");
const connectDB = require("./config/database");

const fixPassword = async () => {
    try {
        await connectDB();
        console.log("Database connected");

        console.log(`Finding user ${targetUserId}...`);
        const user = await User.findById(targetUserId);

        if (!user) {
            console.log("User not found!");
            return;
        }

        console.log(`User found: ${user.firstName} ${user.lastName}`);
        console.log("Old Hash:", user.password);

        const newHash = await bcrypt.hash(newPassword, 10);
        user.password = newHash;

        await user.save();

        console.log("Password updated manually to: " + newPassword);
        console.log("New Hash:", newHash);

        process.exit(0);
    } catch (err) {
        console.error("Error:", err);
        process.exit(1);
    }
};

fixPassword();
