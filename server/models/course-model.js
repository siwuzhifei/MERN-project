const mongoose = require('mongoose');
const {Schema} = mongoose;


const courseSchema = new mongoose.Schema({
    id: {type: String },
    title: {type: String, required: true},
    description: {type: String, required: true},
    price:{type: Number, required: true},
    instructor: {
        type: mongoose.Schema.Types.ObjectId, // like primary key, ref to the User model
        ref: 'User',
    },
    students: {
        type:[string],
        default: [],
    },
});

module.exports = mongoose.model("Course", courseSchema);