/**
 * ================================
 * devTinder Backend – Express Server
 * ================================
 * Purpose:
 * - Demonstrates Express routing
 * - Explains route order, HTTP methods,
 *   query params and route params
 */

const express = require('express');
const app = express();

app.use("/admin/GetData", (req, res, next) => {
  console.log("Admin GetData Middleware");
  next();
});

app.use("/admin/GetData", (req, res) => {
  console.log("Admin GetData Route Handler");
  res.send("Admin GetData Response successful");
});

app.get("/admin/DeleteProfile", (req, res) => {
  res.send("User DeleteProfile Response successful");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
