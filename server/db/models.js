const mongoose = require('./index');
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userMaster = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String
    },
    user_name: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    phone: {
        type: Number,
        match: /[0-9]{10}/
    },
    date: {
        type: Date,
        default: Date.now
    },
    email: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: 'Active'
    },
    user_type: {
        type: String,
        default: 'Student'
    }
});

const token = new Schema({
    value: {
        type: String,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    expiration_date: {
        type: Date,
        required: true
    },
    date_created: {
        type: Date,
        default: Date.now
    },
    created_by: {
        type: String,
        required: true
    }
});

const events = new Schema({
    start: {
        type: String,
        required: false
    },
    rendering: {
        type: String,
        required: false
    },
    backgroundColor: {
        type: String,
        required: false
    },
    title: {
        type: String
    },
    created_by: {
        type: String,
        required: false
    }
});

const UserMaster = mongoose.model("UserMaster", userMaster);
const Token = mongoose.model("Token", token);
const Event = mongoose.model("Event", events);

module.exports = {
    'UserMaster': UserMaster,
    'Token': Token,
    'Event': Event
};
