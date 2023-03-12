const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const isValid = async function (link) {
    try {
        const res = await fetch(`${link}`);
        if (res.status == 200 ) {
            return true
        } else {
            return false
        }
    }
    catch {
        return false
    }
}

const blogSchema = new Schema({
    title: {
        type: String,
        unique: true,
        required: [true, 'Please enter a title']
    },
    body: {
        type: Array
    },
    shortDescr: {
        type: String,
        required: [true, 'Please enter body of the blog']
    },
    coverPhoto: {
        type: String,
        required: true,
        validate: [isValid, 'Please enter a valid link']
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