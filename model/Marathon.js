'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment');
const { string } = require('joi');
const Joi = require("joi");

const schema = new Schema({
    name: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    startTime: String,
    image: String,
    imageEmail: String,
    status: {type: String, default: 'pending'},
    unitRace: String,
    type: String,
    location: String,
    race: [{
        routeMap: String,
        image: String,
        distance: Number,
        award: {
            male: Number,
            female: Number,
        },
    }],
    priceList: [{
        name: String,
        startSell: String,
        endSell: String,
        individual: [{
            price: Number,
            distance: Number,
        }],
    }],
    registerGroup: [{
        numberPerson: {
            from: Number,
            to: Number
        },
        percent: Number,
    }],
    raceKit: [],
    service: {
        image: String,
        description: String,
    },
    schedule: [{
        title: String,
        description: String,
        detail: [{
            time: String,
            description: String,
        }],
    }],
    regulation: [{
        title: String,
        description: String,
    }],
    slug: String,
    updatedAt: String,
    updatedBy: String,
    createdAt: String,
});

schema.pre("save", function (next) {
    const now = moment(moment().unix() * 1000).format("YYYY-MM-DD HH:mm:ss");
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