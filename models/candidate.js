const mongoose = require("mongoose");
//const bcrypt = require("bcrypt");

const candidateschema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    votes: [
        {
            User: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now()
            }
        }
    ],
    typecount: {
        type: Number,
        default: 0
    },
    createdAt :{
        type:Date,
        default: Date.now()
    }
});

const Candidate = mongoose.model("Candidate", candidateschema);
module.exports = Candidate; 