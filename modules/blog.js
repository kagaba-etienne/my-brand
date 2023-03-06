const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: Array,
        required: true
    },
    shortDescr: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    },
    commentsCount: {
        type: Number,
        required: true
    },
    publish: {
        type: Boolean,
        required: true
    },
    author: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;