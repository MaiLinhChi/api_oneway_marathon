
"use strict";

const { default: mongoose } = require('mongoose');
const Model = require('../model/Order')
const BibModel = require('../model/Bib')
const ip = require('ip');
const {vnpayPaymentMethod} = require("../utils/payment");

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
    putOrderById: async (req) => {
        const { id } = req.params;
        try {
            if (!mongoose.Types.ObjectId.isValid(id)) return {message: `Order not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            const order = await Model.findOneAndUpdate({_id: id}, req.payload, {new: true});
            if (!order) return {message: `Order not exist with id: ${id}`, messageKey: `not_exist_with_id: ${id}`, statusCode: 404};
            return {
                message: "Update order detail successfully",
                messageKey: "update_order_detail_successfully",
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
    payOrder: async (req) => {
        const { id } = req.payload
        let validId = true;
        if (!mongoose.Types.ObjectId.isValid(id)) validId = false;
        try {
            const order = await Model.findOne({_id: id})
            if (!order || !validId) {
                return {
                    message: 'Order not found',
                    status: false,
                    statusCode: 404,
                    messageKey: 'not_found'
                }
            }
            if (order.status === 'comfirmed') return {
                message: 'you had paid this order',
                status: false,
                statusCode: 400,
                messageKey: 'paid'
            }
            const { payment, total } = order
            const ipAddress = ip.address();
            const paymentRequest = vnpayPaymentMethod(process.env.ENVIROMENT, ((payment.bankCode).toUpperCase()), total, id, ipAddress);
            await order.updateOne({ ref: paymentRequest.vnp_TxnRef, url: paymentRequest.uri });
            const payUrl = paymentRequest.uri
            return {
                message: 'success',
                status: true,
                data: payUrl
            }
        } catch (error) {
            return {
                message: error.message,
                statusCode: 500
            }
        }
    },
    getOrders: (req) => {
        const {groupId, txnRef, email, registerId, status, fromDate, toDate} = req.query
        const options = {}
        const skip =  req.query.skip || 0
        const limit = req.query.limit || 20
        const sort = req.query.sort || 'desc'

        if(status) options.status = status
        if(txnRef) options.txnRef = txnRef
        if(email) options.email = email
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

