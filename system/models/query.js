const mongoose = require('mongoose');

var QuerySchema = new mongoose.Schema({
    parentUserId: {
        type: String,
        required: true
    },
    parentName: {
        type: String,
        required: true
    },
    childName: {
        type: String,
        required: true
    },
    pickup: {
        address: String,
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    institution: {
        name: String,
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    }
});

mongoose.model("Query", QuerySchema, "queries");