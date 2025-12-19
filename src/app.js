const express = require('express');
const connectDB = require('./config/database');
// const { connect } = require('mongoose');

const app = express();

const User = require('./models/user'); 

app.use(express.json());

// creating a new user
app.post('/signup', async (req, res) => {

    // console.log(req.body); // to see the data sent in the request body in console
    const user = new User(req.body);
    try{
        await user.save();
        res.status(201).send("User created successfully");
    }
    catch(e){
        res.status(500).send("Internal server error" + e.message);
    }
});

// get user from the database by filtering with first name
app.get('/getUserName', async (req, res) => {
    try {
        // what is mean by findById method : it is used to find a document by its unique _id field
        const user = await User.findById({  }); // fetch user with firstName "Dhanasri"
        // findOne returns a single document, find returns an array of documents
        // if (!user) {
        //     return res.status(404).send("User not found");
        // }

        // for (find) method return array of documents
        // user is an array of user objects matching the criteria if user not found it returns an empty array

        //const users = await User.find({}); // fetch all users
        
        if (user.length === 0) {
            return res.status(404).send("User not found");
        }

        res.send(user);
        } catch (err) {
            res.status(500).send("Error fetching user: " + err.message);
        }    
});

// get the all user data 
// app.get('/getAllData', async (req,res) => {
//     try{
//         const users = await User.find({});
//         if(users){
//             res.send(users);
//         }
//         else{
//             res.send("cannot fetch");
//         }
//     }
//     catch(e){
//         res.status(500).send("Internal server error" + e.message);
//     }
// })

// delete a user from the database
app.delete('/deleteUser', async (req, res) =>{
    // how to delete a user file from the database
    const userId = req.body.userId; // assuming userId is sent in the request body
    try {
        await User.findByIdAndDelete(userId); // delete user with the given userId
        res.send("Delete User API");
        console.log("User deleted successfully");
    } catch (err) {
        console.error("Error deleting user:", err);
    }
});

// update user information
app.put('/updateUser', (req, res) => {
    // how to update user information in the database
    const filter = { firstName: "virat" };
    const update = { lastName: "kohli_lastname_updated" };
    User.updateOne(filter, update) // what update to be done -> update firstName to "kohli_lastname_updated"
    .then(() => {
        res.send("Update User API");
        console.log("User updated successfully");
    })
    .catch((err) => {
        console.error("Error updating user:", err);
    });
});

// using patch to update user information partially
app.patch('/patchUser', (req, res) => {
    // how to patch user information in the database
    const filter = { firstName: "virat" };
    const update = { age: 35 }; // only updating age field
    User.updateOne(filter, update)
    .then(() => {
        res.send("Patch User API");
        console.log("User patched successfully");
    }
    )
    .catch((err) => {
        console.error("Error patching user:", err);
    });
});

// connect to the database and start the server

connectDB()
    .then(() => {
        console.log('Database connected successfully');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => {
        console.error('Database connection failed:', err);
    });