
"use strict";

const IpnModel = require('../model/VNPIPN');
const BibModel = require('../model/Bib');
const moment = require("moment");
const sortObject = require("../utils/payment");
const querystring = require("qs");

module.exports = {
    getIpn: async (req) => {
        console.log(req.query)
        let query = {...req.query}
        query = sortObject(query)
        Reflect.deleteProperty(query, 'vnp_SecureHash')
        console.log(query)
        const secretKey = process.env.VNPAY_SECRET_KEY
        const signData = querystring.stringify(query, { encode: false })
        const hmac = crypto.createHmac("sha512", secretKey);
        const signed = hmac.update(signData, 'utf-8').digest("hex")
        console.log(signed)
        console.log(req.query.vnp_SecureHash)
        console.log(req.query.vnp_SecureHash == signed)
        const paymentedModel = await BibModel.findOne({txnRef: req.query.vnp_TxnRef});
        if (req.query.vnp_SecureHash !== signed) return {message: 'Invalid signature', status: 400, RspCode: 97};
        if (!paymentedModel) return {message: 'Order not found', status: 400, RspCode: 1};
        if(paymentedModel.price !== req.query.vnp_Amount) return {message: 'Invalid amount', status: 400, RspCode: 4};
        if (paymentedModel.status === "comfirmed") return {message: 'Order already confirmed', status: 400, RspCode: 2};
        const model = new IpnModel({
            txnRef : req.query.vnp_TxnRef,
            status : req.query.vnp_TransactionStatus == '00' ? 'success' : 'error',
            data: req.query
        })
        await BibModel.findByIdAndUpdate({txnRef: req.query.vnp_TxnRef}, {status: "confirmed"});
        await model.save();
        return {message: 'Confirm Success', status: 400, RspCode: 0};
    }
}


