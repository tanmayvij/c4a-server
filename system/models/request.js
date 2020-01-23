const mongoose = require('mongoose');

var RequestSchema = new mongoose.Schema({
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
    driverUserId: {
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
    },
    carId: {
        type: String,
        required: true
    }
});

mongoose.model("Request", RequestSchema, "requests");