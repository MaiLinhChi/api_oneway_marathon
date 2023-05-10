'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')
const COLLECTION_NAME = 'club'

const schema = new Schema({
    name : {
        type: String,
        require: true
    },
    updatedAt: String,
    updatedBy: String,
    createdAt: String,
}, {collection: COLLECTION_NAME});

schema.pre("save", function (next) {
    const now = moment(moment().unix() * 1000).format("YYYY-MM-DD HH:mm:ss");
    if (!this.createdAt) {
     this.createdAt = now;
    }
    this.membership = moment.utc().unix()
    next();
});
schema.pre("updateOne", function (next) {
    this.updatedAt = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    next();
});

module.exports = mongoose.model(COLLECTION_NAME, schema);