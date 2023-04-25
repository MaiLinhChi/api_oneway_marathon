'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
 email: String,
 marathon: String,
 price: Number,
 distance: Number,
 imageEmail: String, 
 fullName: String,
 birthday: String,
 gender: String,
 nationality: String,
 passport: String,
 gateway: String,
 bankCode: String,
 txnRef: String,
 phone: String,
 state: String,
 address: String,
 emergencyContactName: String,
 emergencyContactPhone: String,
 shirtSize: String,
 nameBib: String,
 timeEstimation: String,
 registerId: { type:String, required: true },
 sendMailOrder: {type: Boolean, default: false},
 sendMailRollBib: {type: Boolean, default: false},
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
module.exports = mongoose.model('bib', schema);