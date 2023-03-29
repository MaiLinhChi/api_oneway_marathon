'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment');
const { string } = require('joi');
const Joi = require("joi");

const schema = new Schema({
    "name" : String,
    "description": String,
    "startTime": String,
    "image": String,
    status: {type: String, default: 'pending'},
    race: [{
        name: String,
        routeMap: String,
        distance: Number, // m
        award: {
            male: Number,
            female: Number,
        },
        price: [{
            name: String,
            startSell: String,
            individual: Number,
            group: Number, // vnd
        }]
    }],
    location: String,
    type: String,
    updatedAt: String,
    updatedBy: String,
    createdAt: String,
});

schema.pre("save", function (next) {
    const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    if (!this.createdAt) {
        this.createdAt = now;
    }
    next();
});
schema.pre("updateOne", function (next) {
    this.updatedAt = moment.utc().format('YYYY-MM-DD HH:mm:ss');
    next();
});
schema.index({createdAt: 1},{expireAfterSeconds: 8640000});
module.exports = mongoose.model('marathon', schema);