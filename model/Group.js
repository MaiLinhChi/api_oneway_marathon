'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
 groupId: String,
 marathonId: String,
 groupName: String,
 password: String,
 status: {type: String, default: 'pending'},
 membership: [
   {
      userId: {
         type: String,
         default: null
      },
      role: {
         type: String,
         enum: ['captain', 'vice', 'member'],
         default: 'member'
      },
      email: String,
      phone: String,
      fullName: String,
      timeJoined: String
   }
 ],
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
schema.index({ username: 1 });
schema.index({ email: 1 }, { unique: true });
schema.index({ mobile: 1 });
module.exports = mongoose.model('group', schema);