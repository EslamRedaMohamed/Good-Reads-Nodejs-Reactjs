const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema({
    photo: String,
    fullName: {
        type: String,
        required: true,
        unique: true
    },
    dateOfBirth: Date,
});

module.exports = mongoose.model('Author', authorSchema);