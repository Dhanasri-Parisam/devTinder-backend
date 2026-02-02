const axios = require('axios');

const signupData = {
    firstName: "Test",
    lastName: "User",
    emailId: `testuser_${Date.now()}@example.com`,
    password: "StrongPassword@123",
    gender: "Male",
    age: 25
};

async function checkSignup() {
    try {
        console.log("Attempting signup with:", signupData);
        const response = await axios.post('http://localhost:3000/signup', signupData);
        console.log("Signup Response:", response.status, response.data);
    } catch (error) {
        if (error.response) {
            console.error("Signup Failed:", error.response.status, error.response.data);
        } else {
            console.error("Signup Error:", error.message);
        }
    }
}

checkSignup();
