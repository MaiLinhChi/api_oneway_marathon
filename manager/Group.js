
"use strict";

const { hashPassword } = require('../utils/userFunctions');
const bcrypt = require('bcrypt');
const Model = require('../model/Group')
const MarathonModel = require('../model/Marathon')
const MUUID = require('uuid-mongodb')
const moment = require("moment");
const { default: mongoose } = require('mongoose');

const  generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const charactersLength = characters.length;
    
    for (let  i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
      }
    
    return result;
  }

module.exports = {
    getById: (req) => {
        return Model.findOne({_id: req.params.id}).select('-password -__v -createdAt').lean().then(async data => {
            const marathon = await MarathonModel.findOne({_id: data.marathonId})
            if (!marathon) return {
                message: 'marathon does not existed',
                statusCode: 404,
                messageKey: 'not_found'
            }
            const res = {
                ...data,
                marathonName: marathon.name,
                startTime: marathon.startTime
            }
            return {
                res
            }
        })
    },
    get:  (req) => {
        const {keyword, groupId, marathonId, groupName, fullName, email, phone, role, fromDate, toDate, pageSize, pageIndex} = req.query
        const options = {}
        const keywordCondition = keyword ? { $or:[
            { groupId: { $regex: keyword, $options: 'i'} },  
            { marathonId: { $regex: keyword, $options: 'i'} },  
            { fullName: { $regex: keyword, $options: 'i'} },
            { groupName: { $regex: keyword, $options: 'i'} },
            { email: { $regex: keyword, $options: 'i'} },
            { phone: { $regex: keyword, $options: 'i'} },
            { role: { $regex: keyword, $options: 'i'} },  
        ]} : {} 
        const skip =  pageIndex - 1 || 0
        const limit = pageSize || 20
        const sort = req.query.sort || 'asc'

        if(groupId) options.groupId = groupId
        if(marathonId) options.marathonId = marathonId
        if(groupName) options.groupName = groupName
        if(fullName) options.fullName = { $regex: new RegExp(req.query.fullName), $options: 'i' }
        if(phone) options.phone = phone
        if(email) options.email = email
        if(role) options.role = role
        // if(fromDate && toDate) options.CreatedOn = {$gte: new Date(fromDate), $lte: new Date(toDate)}
        if(fromDate || toDate) options.CreatedOn = {}
        if(fromDate) options.CreatedOn.$gte =  new Date(moment(fromDate,'DD/MM/YYYY').format("MM/DD/YYYY"))
        if(toDate) options.CreatedOn.$lte =  new Date(moment(toDate, 'DD/MM/YYYY').format("MM/DD/YYYY"))
        console.log(new Date(moment(fromDate,'DD/MM/YYYY').format("MM/DD/YYYY")))
        console.log(new Date(moment(toDate,'DD/MM/YYYY').format("MM/DD/YYYY")))
        
        return Model.find({$and: [options, keywordCondition]}).limit(limit).skip(skip * limit).sort({
            CreatedOn: sort
        }).lean().then(async rs => {
            const totalRecord = await Model.countDocuments({$and: [options, keywordCondition]})
            const newRes = await Promise.all(rs.map(async r=>{
                const marathon = await MarathonModel.findOne({_id: r.marathonId}).lean()
                return {
                ...r,
                marathonName: marathon.name
                }
            }))
            return {
                totalRecord,
                totalPaging: Math.ceil(totalRecord / limit),
                data: newRes
            }
        })
    },
    post: async (req) => {
        const group = await Model.findOne({email: req.payload.email});
        if(group) {
            if(group.verified && group.username) return {statusCode: 400, message: 'email is existed !', errorCode: 'EMAIL_EXISTED'};
            // return sendCodeVerify(req, user)
        }
        const marathon = await MarathonModel.findOne({_id: req.payload.marathonId}).lean()
        if (!marathon) return {
            message: 'marathon does not existed',
            statusCode: 404,
            messageKey: 'not_found'
        }
        return new Promise(resolve => {

            hashPassword(req.payload.password, async (err, hash) => {
                if (err) {
                    resolve({statusCode: 400, message: err.toString()})
                } else {
                    req.payload.password = hash;
                    req.payload.updatedBy = 'register';
                    const owner = {
                        fullName: req.payload.fullName,
                        email: req.payload.email,
                        phone: req.payload.phone,
                        role: 'leader',
                        timeJoined: moment().unix()
                    }
                    let randomString
                    let isExistCode
                    do {
                        randomString = generateRandomString(8)
                        isExistCode = await Model.findOne({groupCode: randomString})
                    } while (isExistCode)
                    req.payload.groupCode = randomString
                    req.payload.membership = [owner]
                    req.payload.linkJoin = `${process.env.URL_CLIENT}/${marathon.slug}/${randomString}`
                    const model = new Model(req.payload)
                    model.save().then(rs => resolve({
                        message: 'success',
                        statusCode: 201,
                        data: rs,
                        messageKey: 'post_success'
                    })).catch(e => {
                       resolve({statusCode: 400, message: e.toString()})
                    })
                }
            });
        })

    },
    deleteById: async (req) => {
        const { id } = req.params;
        try {
        if (!mongoose.Types.ObjectId.isValid(id))
            return { message: `No brand with id: ${id}`, statusCode: 404 };
        const group = await Model.findByIdAndDelete({ _id: id });
        if (!group)
            return {
            message: "Not found brand",
            status: false,
            statusCode: 404,
            messageKey: "brand_not_found",
            data: group,
            };
        return {
            message: "Delete group success",
            data: group,
            status: 200,
        };
        } catch (error) {
        return error;
        }
    },
}


