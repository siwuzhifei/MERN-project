const mongoose = require('mongoose');
const {Schema} = mongoose;
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 50,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ["student", "instructor"],
        required: true,
    },
    data: {
        type: Date,
        default: Date.now,
    },
});


// instance method
userSchema.methods.isStudent = function() {
    return this.role === "student";
};

userSchema.methods.isInstructor = function() {
    return this.role === "instructor";
};
userSchema.methods.comparePassword = async function(password,cb) {
    let result;
    // this refers to the current document in mongoDB
    try{
        result = await bcrypt.compare(password, this.password);
        return cb(null, result);
    } catch (err) {
        return cb(err, result);
    };

// mongoose middleware
// if usr is new, or change the password, hash the password
userSchema.pre("save", async function(next) {
    // this refers to the current document in mongoDB
    if (this.isNew || this.isModified("password")) {
        // hash the password
        const hashValue = await bcrypt.hash(this.password, 10);
        this.password = hashValue;
    }
    next();
});


module.exports = mongoose.model("User", userSchema);