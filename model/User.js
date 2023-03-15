'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
 username: String,
 email: String,
 password: String,
 fullname: String,
 mobile: String,
 avatar: String,
 role: {type: String, default: 'user'},
 status: {type: String, default: 'active'},
 verifyEmail: String,
 resendVerifyEmail: {type: Number, default: 0},
 timeResendVerifyEmail: Number,
 verified: {type: Boolean, default: false},
 membership: Number,
 updatedAt: String,
 updatedBy: String,
 createdAt: String,
});

schema.pre("save", function (next) {
 const now = moment.utc().format('YYYY-MM-DD HH:mm:ss');
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
schema.index({ username: 1 });
schema.index({ email: 1 }, { unique: true });
schema.index({ mobile: 1 });
module.exports = mongoose.model('user', schema);