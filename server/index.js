const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();
const authRoute = require('./routes').auth;
const courseRoute = require('./routes').course;
const passport = require('passport');
require('./config/passport')(passport);
const cors = require('cors');

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
app.use(cors());


app.use("/api/user", authRoute);

//Only the one who has logged in can access coures
//jwt is used to authenticate the user
// if request header without jwt token, request is unauthorized and will be rejected
app.use("/api/course", 
    //use middleware to authenticate the user
    passport.authenticate('jwt', { session: false }), 
    courseRoute);


app.listen(8080, () => {
    console.log("Server is running on port 8080");
});
