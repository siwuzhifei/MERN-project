const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const authRoute = require('./routes').auth;

// Connect to MongoDB

mongoose.connect("mongodb://localhost:27017/mernDB")
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.log(err);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/user", authRoute);

//Only the one who has logged in can access coures
//jwt



app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
