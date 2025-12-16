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

/**
 * --------------------------------
 * ROUTING ORDER (IMPORTANT)
 * --------------------------------
 * Express processes routes top → bottom.
 * - First matching route is executed
 * - Specific routes must come before generic ones
 */

/**
 * --------------------------------
 * ROUTE PARAMETERS (req.params)
 * --------------------------------
 * Used for:
 * - Mandatory values
 * - Identifying specific resources
 *
 * Example URL:
 * http://localhost:3000/user/101/John/1234
 *
 * req.params output:
 * {
 *   userId: "101",
 *   name: "John",
 *   password: "1234"
 *
 * ⚠️ Security Note:
 * Never pass sensitive data (like passwords) in URLs
 */
app.get("/user/:userId/:name/:password", (req, res) => {
    console.log(req.params);
    res.send({ firstName: 'John', lastName: 'Doe' });
});

/**
 * --------------------------------
 * HTTP METHODS ON SAME ROUTE (/user)
 * --------------------------------
 * Same path + different HTTP methods
 * do NOT conflict with each other
 */

/**
 * POST → Create new data
 */
app.post("/user", (req, res) => {
    res.send("USER data created (POST)");
});

/**
 * DELETE → Remove data
 */
app.delete("/user", (req, res) => {
    res.send("USER data deleted (DELETE)");
});

/**
 * PUT → Update entire data
 */
app.put("/user", (req, res) => {
    res.send("USER data fully updated (PUT)");
});

/**
 * PATCH → Update partial data
 */
app.patch("/user", (req, res) => {
    res.send("USER data partially updated (PATCH)");
});

/**
 * --------------------------------
 * GENERAL ROUTE
 * --------------------------------
 * Must be defined at the end
 * to avoid catching all requests
 */
app.get("/", (req, res) => {
    res.send("Welcome to devTinder Backend");
});

/**
 * --------------------------------
 * SERVER LISTENING
 * --------------------------------
 * Starts the Express server
 * and listens for incoming requests
 */
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

/**
 * --------------------------------
 * EXPORT APP
 * --------------------------------
 * Useful for:
 * - Testing
 * - Reusability
 */
module.exports = app;

/**
 * ==================================
 * FINAL CONCLUSIONS
 * ==================================
 * 1. Route order matters in Express.
 * 2. Specific routes should come before generic ones.
 * 3. Same route path can handle multiple HTTP methods.
 * 4. req.params → mandatory path values.
 * 5. req.query → optional URL parameters.
 * 6. Sensitive data should never be sent via URL.
 * 7. Postman is used to test all HTTP methods.
 */
