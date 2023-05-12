'use strict';

const mongoose  = require('mongoose');
const Schema    = mongoose.Schema;
const moment = require('moment')

const schema = new Schema({
 marathonId: String,
 groupCode: String,
 linkJoin: String,
 groupName: {
   type: String,
   trim: true
 },
 password: String,
 status: {
   type: String,
   enum: ['pending', 'active'],
   default: 'pending'
},
 membership: [
   {
      role: {
         type: String,
         enum: ['leader', 'vice', 'member'],
         default: 'member'
      },
      email: String,
      phone: String,
      fullName: {
         type: String,
         trim: true
      },
      timeJoined: Number
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

module.exports = mongoose.model('group', schema);