'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
 groupId: {
   type: String,
   ref: "groups"
 },
 marathonId: String,
 products: [String],
 payment: {
    gateway: String,
    bankCode: String,
    fee: Number
 },
 email: String,
 total: Number,
 sendMailOrder: {type: Boolean, default: false},
 status: {type: String, default: 'pending'},
 url: String,
 ref: String,
 registerId: String,
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

schema.index({groupId: 1});
module.exports = mongoose.model('order', schema);