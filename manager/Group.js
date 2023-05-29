
"use strict";

const { hashPassword } = require('../utils/userFunctions');
const bcrypt = require('bcrypt');
const Model = require('../model/Group')
const MarathonModel = require('../model/Marathon')
const BibModel = require('../model/Bib')
const MUUID = require('uuid-mongodb')
const moment = require("moment");
const { default: mongoose } = require('mongoose');
const { sendEmailCreateGroup } = require('../email/create-group');
const sendgrid = require('../utils/sendgrid');
const { sendEmailJoinGroup } = require('../email/join-group');

const generateRandomString = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const charactersLength = characters.length;
    
    for (let  i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
      }
    
    return result;
  }

module.exports = {
    generateRandomString,
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
        const {keyword, groupId, marathonId, groupCode, groupName, fullName, email, phone, role, fromDate, toDate, pageSize, pageIndex} = req.query
        const options = {}
        const keywordCondition = keyword ? { $or:[
            { groupId: { $regex: keyword, $options: 'i'} },  
            { marathonId: { $regex: keyword, $options: 'i'} },  
            { fullName: { $regex: keyword, $options: 'i'} },
            { groupName: { $regex: keyword, $options: 'i'} },
            { groupCode: { $regex: keyword, $options: 'i'} },
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
        if(groupCode) options.groupCode = groupCode
        if(fullName) options.fullName = { $regex: new RegExp(req.query.fullName), $options: 'i' }
        if(phone) options.phone = phone
        if(email) options.membership = {$elemMatch: {email}}
        if(role) options.membership = {$elemMatch: {role}}
        // if(fullName) options.membership = {$elemMatch: {fullName: { $regex: new RegExp(req.query.fullName), $options: 'i' }}}
        if(fromDate || toDate) options.CreatedOn = {}
        if(fromDate) options.CreatedOn.$gte =  new Date(moment(fromDate,'DD/MM/YYYY').format("MM/DD/YYYY"))
        if(toDate) options.CreatedOn.$lte =  new Date(moment(toDate, 'DD/MM/YYYY').format("MM/DD/YYYY"))
        
        return Model.find({$and: [options, keywordCondition]}).limit(limit).skip(skip * limit).sort({
            CreatedOn: sort
        }).lean().then(async rs => {
            const totalRecord = await Model.countDocuments({$and: [options, keywordCondition]})
            const newRes = await Promise.all(rs.map(async r=>{
                const marathon = await MarathonModel.findOne({_id: r.marathonId}).lean()
                return {
                ...r,
                marathonName: marathon.name,
                location: marathon.location,
                startTime: marathon.startTime,
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
        const group = await Model.findOne({groupName: req.payload.groupName});
        if(group) {
            if(group.groupName) return {statusCode: 400, message: 'Group name is existed !', errorCode: 'GROUP NAME_EXISTED'};
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
                    model.save().then(async (rs) => {
                        const marathon = await MarathonModel.findOne({_id: rs.marathonId}).lean()
                        const group = { ...rs._doc, marathonName: marathon.name, marathonId: marathon._id }
                        const msg = {
                            to: req.payload.email, // Change to your recipient
                            from: 'admin@onewaymarathon.com', // Change to your verified sender
                            subject: `Xác nhận tạo nhóm thành công Oneway marathon ${marathon.name}`,
                            html: sendEmailCreateGroup(group, process.env.URL_CLIENT),
                        }
                        const result = await sendgrid.send(msg);
                        if(result[0].statusCode === 202) {
                            await rs.updateOne({ sendEmail: true });
                        }
                        resolve({
                            message: 'success',
                            statusCode: 201,
                            data: rs,
                            messageKey: 'post_success'
                        })
                    }).catch(e => {
                       resolve({statusCode: 400, message: e.toString()})
                    })
                }
            });
        })

    },
    joinGroup: async (req) => {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) return {statusCode: 400, message: 'Group does not existed !', messageKey: 'group_not_existed'};
        const group = await Model.findOne({_id: req.params.id});
        if(!group) return {statusCode: 400, message: 'Group does not existed !', messageKey: 'group_not_existed'};
        const exitEmail = group.membership.find((member) => member.email === req.payload.email);
        if(exitEmail) return {statusCode: 400, message: 'You have joined this group!', messageKey: 'group_not_existed'};
        try {
            const res = await Model.findByIdAndUpdate(req.params.id, {$push: {membership: {
                fullName: req.payload.fullName,
                email: req.payload.email,
                phone: req.payload.phone,
                timeJoined: moment().unix()
            }}}, {new: true});
            const bib = await BibModel.findById(req.payload.bibId);
            const msg = {
                to: req.payload.email, // Change to your recipient
                from: 'admin@onewaymarathon.com', // Change to your verified sender
                subject: `Tham gia nhóm thành công - OneWay Marathon`,
                html: sendEmailJoinGroup(group, bib),
            }
            await sendgrid.send(msg);
            return {
                data: res,
                message: 'Join the group successfully',
                messageKey: 'join_group_successfully'
            };
        } catch (error) {
            return error
        }
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
    loginGroup: (req) => {
        const { password, _id } = req.payload;
        return Model.findOne({_id: _id}).then(group => {
            if (!group) return {statusCode: 400, message: 'Invalid credentials!', messageKey: 'invalid_credentials'}
            return new Promise(resolve => {
                bcrypt.compare(password, group.password, (err, isValid) => {
                    if (err) return {statusCode: 400, message: 'Incorrect Password!'};
                    if (isValid) {
                        const { password, ...rest } = group._doc;
                        resolve({group: {...rest}, statusCode: 200, messageKey: 'login_group_success'});
                    } else {
                        resolve({statusCode: 400, message: 'Invalid credentials!', messageKey: 'invalid_credentials'})
                    }
                });
            })
        }).catch(e => {
            console.log(e.toString())
            return {statusCode: 400, message: e.toString()}
        })
    },
}


