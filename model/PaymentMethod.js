'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
    gateway: String,
    bankCode: String,
    name: String,
    fee: Number,
    feePercent: Number,
    isDefault: {type: Boolean, default: false},
    status: {type: String, default: 'pending'},
    updatedAt: String,
    updatedBy: String,
    createdAt: String,
});

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
schema.index({createdAt: 1},{expireAfterSeconds: 8640000});
module.exports = mongoose.model('payment-method', schema);