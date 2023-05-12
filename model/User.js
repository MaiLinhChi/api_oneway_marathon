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
 status: {
   type: String,
   enum: ['pending', 'active'],
   default: 'pending'
},
 verifyEmail: String,
 resendVerifyEmail: {type: Number, default: 0},
 timeResendVerifyEmail: Number,
 verified: {type: Boolean, default: false},
 type: { // Loại account khi đăng kí tài khoản
    type: String,
    enum: ['normal', 'facebook', 'gmail'],
    default: 'normal'
 },
 loginTime: Number,
 membership: Number,
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
schema.index({ username: 1 });
schema.index({ email: 1 });
schema.index({ mobile: 1 });
module.exports = mongoose.model('user', schema);