
"use strict";

const { default: mongoose } = require('mongoose');
const Model = require('../model/Bib')
const MarathonModel = require('../model/Marathon')
const GroupModel = require('../model/Group')
const moment = require("moment");
const sendgrid = require('../utils/sendgrid');
const { sendEmailUpdateMember } = require('../email')
module.exports = {
    putById: async (req) => {
        const { id } = req.params
        const { groupId } = req.payload
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return {message: `Bib not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            const bib = await Model.findOneAndUpdate({_id: id}, req.payload, {new: true});
            if (!bib) return {message: `bib not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            if (groupId) {
                if (!mongoose.Types.ObjectId.isValid(groupId)) return {message: `Bib not exist with id: ${id}`, messageKey: `group_not_found`, statusCode: 404};
                const group = await GroupModel.findById(groupId)
                if (!group) return {message: `group not exist with id: ${groupId}`, messageKey: `group_not_found`, statusCode: 404};
                const msg = {
                    to: bib.email,
                    from: 'admin@onewaymarathon.com',
                    subject: `Thông báo thay đổi thông tin thành viên nhóm - OneWay Marathon`,
                    html: sendEmailUpdateMember(group, bib),
                }
                await sendgrid.send(msg)
            }
            return {
                message: "Update bib detail successfully",
                messageKey: "update_bib_detail_successfully",
                data: bib,
                statusCode: 200
            }
        } catch (error) {
            return error;
        }
    },
    getById: (req) => {
        return Model.findOne({_id: req.params.id}).then(async (item) => {

            const marathon = await MarathonModel.findOne({_id: item.marathon.marathonId})
            if(item) {
                const bib = item._doc

                return {
                    data: {
                        ...bib,
                        marathon: {
                            ...bib.marathon,
                            name: marathon.name,
                            startTime: marathon.startTime
                        }
                    },
                    status: 200
                }
            }
            return {
                message: "Not bib with id " + req.params.id,
                status: 400
            }
        })
    },
    get:  (req) => {
        const {keyword, status, email, marathon, price, groupId, fromDate, toDate, pageSize, pageIndex} = req.query
        const options = {}
        const keywordCondition = keyword ? { $or:[
            { username: { $regex: keyword, $options: 'i'} },
            { mobile: { $regex: keyword, $options: 'i'} },
            { email: { $regex: keyword, $options: 'i'} },
            { name: { $regex: keyword, $options: 'i'} },         
        ]} : {} 
        const skip =  pageIndex ? pageIndex - 1 : 0
        const limit = pageSize || 20
        const sort = req.query.sort || 'asc'

        if(status) options.status = status
        if(groupId) options.groupId = groupId
        if(email) options.email = { $regex: new RegExp(req.query.email), $options: 'i' }
        if(marathon) options["marathon.marathonId"] = marathon
        if(price) options.price = price
        // if(fromDate && toDate) options.CreatedOn = {$gte: new Date(fromDate), $lte: new Date(toDate)}
        if(fromDate || toDate) options.CreatedOn = {}
        if(fromDate) options.CreatedOn.$gte =  new Date(moment(fromDate,'DD/MM/YYYY').format("MM/DD/YYYY"))
        if(toDate) options.CreatedOn.$lte =  new Date(moment(toDate, 'DD/MM/YYYY').format("MM/DD/YYYY"))
        
        return Model.find({$and: [options, keywordCondition]}).limit(limit).skip(skip * limit).sort({
            CreatedOn: sort
        }).then(async rs => {
            const totalRecord = await Model.countDocuments({$and: [options, keywordCondition]})
            const newRes = rs.map(r=>{
                const {...res} = r._doc
                return {
                ...res,
                }
            })
            return {
                totalRecord,
                totalPaging: Math.ceil(totalRecord / limit),
                data: newRes
            }
        })
    },
    post: async (req) => {
        // const bib = await Model.find({marathon: req.payload.marathon});
        // const isHaving = bib.find((item) => item.email === req.payload.email || item.phone === req.payload.phone || item.passport === req.payload.passport);
        // if(isHaving && isHaving.email === req.payload.email) {
        //     return {statusCode: 400, message: 'Email is existed !', errorCode: 'EMAIL_EXISTED'};
        // } else if(isHaving && isHaving.phone === req.payload.phone) {
        //     return {statusCode: 400, message: 'Phone is existed !', errorCode: 'PHONE_EXISTED'};
        // } else if(isHaving && isHaving.passport === req.payload.passport) {
        //     return {statusCode: 400, message: 'Passport is existed !', errorCode: 'PASSPORT_EXISTED'};
        // }
        const {_id} = req.payload
        if (_id) {
            await Model.findByIdAndDelete(_id)
        }
        const model = new Model(req.payload)
        return new Promise(resolve => {
            model.save().then((obj) => resolve({status: 200, message: "Register suscess", data: obj})).catch(e => {
                resolve({statusCode: 400, message: e.toString()})
            })
        })
    },
}


