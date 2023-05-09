'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
    _id: String,
    Name : String,
    Level: Number,
    DistrictId: String,
});

schema.index({ DistrictId: 1 });
module.exports = mongoose.model('Ward', schema);