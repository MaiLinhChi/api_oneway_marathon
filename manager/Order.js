
"use strict";

const { default: mongoose } = require('mongoose');
const Model = require('../model/Order')
const BibModel = require('../model/Bib')

module.exports = {
    deleteOrderById: async (req) => {
        const { id } = req.params;
        try{
            if (!mongoose.Types.ObjectId.isValid(id)) return {message: `Order not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            const order = await Model.findByIdAndDelete({_id: id});
            if(!order) return {message: `Order not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            return {message: 'Delete payment method successfully', data: order, status: 200};
        } catch (error) {
            return error
        }
    },
    putOrderById: (req) => {
        const { id } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return {message: `Order not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            const order = Model.findOneAndUpdate({_id: req.params.id}, req.payload, {new: true});
            if (!order) return {message: `Order not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            return {
                message: "Delete order detail successfully",
                messageKey: "delete_order_detail_successfully",
                data: order,
                statusCode: 200
            }
        } catch (error) {
            return error;
        }
    },
    getOrderById: async (req) => {
        const { id } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return {message: `Order not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            const order = await Model.findOne({_id: id});
            if (!order) return {message: `Order not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            const bibs = await BibModel.find({_id : { $in : order.products }});
            return {
                message: "Get order detail successfully",
                messageKey: "get_order_detail_successfully",
                data: {
                    order,
                    bibs
                },
                statusCode: 200
            }
        } catch (error) {
            return error
        }
    },
    getOrders: (req) => {
        const {groupId, txnRef, registerId, status, fromDate, toDate} = req.query
        const options = {}
        const skip =  req.query.skip || 0
        const limit = req.query.limit || 20
        const sort = req.query.sort || 'desc'

        if(status) options.status = status
        if(txnRef) options.txnRef = txnRef
        if(registerId) options.registerId = registerId
        if(groupId) options.groupId = { $regex: new RegExp(req.query.groupId), $options: 'i' }
        if(fromDate && toDate) options.startTime = {$gte: fromDate, $lte: toDate}
        
        return Model.find({$and: [options]}).limit(limit).skip(skip * limit).sort({
            createdAt: sort
        }).then(async rs => {
            const totalRecord = await Model.countDocuments(options)
            
            return {
                data: rs,
                status: 200,
                message: "Get list orders successfully",
                messageKey: "get_list_orders_successfully",
                totalRecord,
                totalPage: Math.ceil(totalRecord / limit),
            }
        })
    },
    postOrder: (req) => {
        const model = new Model(req.payload)
        return new Promise(resolve => {
            model.save().then((obj) => resolve({statusCode: 200, data: obj, message: "Order suscessfully", messageKey: "order_suscessfully"})).catch(e => {
                resolve({statusCode: 400, message: e.toString()})
            })
        })
    },
}

