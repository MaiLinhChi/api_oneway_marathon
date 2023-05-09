'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const schema = new Schema({
    _id: String,
    Name : String,
    Level: Number,
});

module.exports = mongoose.model('Province', schema);