const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    publish: {
        type: Boolean,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    rest: {
        type: String,
        required: false
    },
    shortDescr: {
        type: String,
        required: true
    },
    coverPhoto: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;