const mongoose = require("mongoose");

const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 50
    },
    photo: {
        type: String
    },
    link: {
        type: String,
        trim: true,
        required: true,
        unique: true,
        maxlength: 45
    }
}, { timestamps: true });

module.exports = mongoose.model("Movie", movieSchema);