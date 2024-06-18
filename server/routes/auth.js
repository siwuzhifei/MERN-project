const router = require('express').Router();
const registerValidation = require('../validation').registerValidation;
const loginValidation = require('../validation').loginValidation;
const User = require('../models').user;
const jwt = require('jsonwebtoken');
const { user } = require('../models');


router.use((req, res, next) => {
    console.log("Receiving a req from Auth middleware");
    next();
});


router.get("/testAPI", (req, res) => {
    res.send("Connect to Auth route");
});
router.post("/register", async (req, res) => {
    // validate the data before creating a user
    let {error} = registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    // check if the email is already in the database
    const emailExist = await User.findOne({ email: req.body.email });
    if (emailExist) {
        return res.status(400).send("Email already exists");
    }
    // create a new user
    let {username, email, password, role} = req.body;
    let newUser = new User({username,email,password,role});
    try {
        let savedUser = await newUser.save();
        res.send({
            msg: "User is created",
            savedUser,
        });
    } catch (err) {
        res.status(400).send("Cannot save a new user");
}
});
router.post("/login", async (req, res) => {
    // validate the data before logging in
    let {error} = loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);}
    // check if the email exists
    const foundUser = await User.findOne({ email: req.body.email });
    if (!foundUser) {
        return res.status(401).send("User is not found, please check your email");
    }
    // check if the password is correct
    foundUser.comparePassword(req.body.password, async (err, isMatch) => {
        if (err) {
            return res.status(500).send(err);
        }
        if (isMatch) {
        // create a json web token
        const tokenObject = { _id: foundUser._id, email: foundUser.email }
        const token = jwt.sign(tokenObject, process.env.PASSPORT_SECRET);
        return res.send({
            message: "Logged in successfully",
            token: "JWT " + token,
            user: foundUser,
        });
    }
        else { 
            return res.status(401).send("Password is not correct");
        }


    });

});


module.exports = router;
