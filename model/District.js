'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const COLLECTION_NAME = 'district'

const schema = new Schema({
    _id: String,
    provinceId: String,
    name : String,
    level: Number,
}, {collection: COLLECTION_NAME});

// schema.index({ provinceId: 1 });
module.exports = mongoose.model(COLLECTION_NAME, schema);