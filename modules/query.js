const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const querySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: false
    },
    message: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: false
    },
    status: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Query = mongoose.model('Query', querySchema);
module.exports = Query;