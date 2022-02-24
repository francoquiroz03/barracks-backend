const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const recordSchema = new mongoose.Schema({
    token: {
        type: String,
        trim: true,
        required: true,
        maxlength: 200
    },
    device: {
        type: String,
        required: true,
        maxlength: 100
    },
    user: {
        type: ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model("Record", recordSchema);