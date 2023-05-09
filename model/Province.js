'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;

const COLLECTION_NAME = 'province'

const schema = new Schema({
    _id: String,
    name : String,
    level: String,
}, {collection: COLLECTION_NAME});

module.exports = mongoose.model(COLLECTION_NAME, schema);