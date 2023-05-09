'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
    _id: String,
    ProvinceId: String,
    Name : String,
    Level: Number,
});

schema.index({ ProvinceId: 1 });
module.exports = mongoose.model('District', schema);