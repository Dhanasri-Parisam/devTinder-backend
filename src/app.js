// ======================= IMPORTS =======================
const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const connectDB = require("./config/database");
const { validateSignUpData } = require("./utils/validation");
const { userAuth } = require("./middlewares/auth");
const User = require("./models/user");

// ======================= APP INIT =======================
const app = express();

// ======================= MIDDLEWARE ====================
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: "http://localhost:5173", // React app
    credentials: true,
  })
);

// ======================= ROUTES =======================
const authRouter = require("./router/auth");
const profileRouter = require("./router/profile");
const connectionRouter = require("./router/connection");
const deleteRouter = require("./router/delete");
const getUsersRouter = require("./router/getUsers");
const requestRouter = require("./router/request");
const userRouter = require("./router/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", connectionRouter);
app.use("/", deleteRouter);
app.use("/", getUsersRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

/* Or alternatively, you can mount them under specific paths:
app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/connection", connectionRouter);
app.use("/delete", deleteRouter);
app.use("/getUsers", getUsersRouter);
app.use("/request", requestRouter);
*/

// ======================= DB + SERVER =======================
connectDB()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server running on port 3000");
    });
  })
  .catch((err) => console.error(err));
