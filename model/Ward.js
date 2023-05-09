'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const COLLECTION_NAME = 'ward'

const schema = new Schema({
    _id: String,
    name : String,
    level: Number,
    districtId: String,
}, {collection: COLLECTION_NAME});

// schema.index({ districtId: 1 });
module.exports = mongoose.model(COLLECTION_NAME, schema);