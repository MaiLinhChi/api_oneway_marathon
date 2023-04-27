
"use strict";

const Model = require('../model/PaymentMethod')
const moment = require("moment");
const { default: mongoose } = require('mongoose');

module.exports = {
    deleteById: async (req) => {
        const { id } = req.params;
        try{
            if (!mongoose.Types.ObjectId.isValid(id)) return {message: `No brand with id: ${id}`, status: 404};
            const ins = await Model.findByIdAndDelete({_id: id});
            if(!ins) return {message: `No brand with id: ${id}`, status: 404, data: ins};
            return {message: 'Delete payment method successfully', data: ins, status: 200};
        } catch (error) {
            return error
        }
    },
    putById: async (req) => {
        const { id } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return {message: `No brand with id: ${id}`, status: 404};
            const ins = await Model.findByIdAndDelete({_id: id});
            if(!ins) return {message: `No brand with id: ${id}`, status: 404, data: ins};
            const item = await Model.findOneAndUpdate({_id: req.params.id}, req.payload, {new: true});
            if(item) {
                return {
                    data: item,
                    message: "Edit payment method successfully",
                    status: 200
                }
            }
            return {
                message: "Edit payment method unsuccessfully",
                status: 400
            }
        } catch (error) {
            return {
                status: 500,
                message: error.message
            }
        }
    },
    getById: (req) => {
        return Model.findOne({_id: req.params.id}).then(item => {
            return {
                item
            }
        })
    },
    get:  (req) => {
        const {keyword, gateway, name, bankCode, fee, feePercent, isDefault, status, fromDate, toDate, pageSize, pageIndex} = req.query
        const options = {}
        const keywordCondition = keyword ? { $or:[
            { username: { $regex: keyword, $options: 'i'} },
            { mobile: { $regex: keyword, $options: 'i'} },
            { email: { $regex: keyword, $options: 'i'} },
            { name: { $regex: keyword, $options: 'i'} },         
        ]} : {} 
        const skip =  pageIndex - 1 || 0
        const limit = pageSize || 20
        const sort = req.query.sort || 'asc'

        if(status) options.status = status
        if(gateway) options.gateway = { $regex: new RegExp(req.query.Name), $options: 'i' }
        if(name) options.name = name
        if(bankCode) options.bankCode = bankCode
        if(fee) options.fee = fee
        if(feePercent) options.feePercent = feePercent
        if(isDefault) options.isDefault = isDefault
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
    post: (req) => {
        const model = new Model({
            gateway: req.payload.gateway,
            bankCode: req.payload.bankCode,
            fee: req.payload.fee,
            name: req.payload.name,
            feePercent: req.payload.feePercent,
            isDefault: req.payload.isDefault,
            status: req.payload.status,
        })
        return new Promise(resolve => {
            model.save().then((res) => resolve({status: 200, message: "Add payment method suscess", data: res})).catch(e => {
                resolve({statusCode: 400, message: e.toString()})
            })
        })
    },
}


