const mongoose = require('mongoose');
const bulletinSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        required: false
    },
    date: {
        type: Date,
        required: true,
        default: Date.now
    },
    upvote: {
        type: Number,
        default: 0
    },
    downvote: {
        type: Number,
        default: 0
    }
})

module.exports = mongoose.model('Bulletin', bulletinSchema)