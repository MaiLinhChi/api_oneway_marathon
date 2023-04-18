
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
        const model = new IpnModel({
            txnRef : req.query.vnp_TxnRef,
            status : req.query.vnp_TransactionStatus == '00' ? 'success' : 'error',
            data: req.query
        })
        const ipnSaved = await model.save();
        const paymentedModel = await BibModel.findOne({txnRef: req.query.vnp_TxnRef});
        if(ipnSaved) {
            if (req.query.vnp_SecureHash === signed) {
                if (!paymentedModel) {
                    if(paymentedModel.price === req.query.vnp_Amount) {
                        if (paymentedModel.status !== "comfirmed") {
                            await BibModel.findByIdAndUpdate({txnRef: req.query.vnp_TxnRef}, {status: "confirmed"});
                            return {message: 'Confirm Success', status: 400, RspCode: 0, data: ipnSaved};
                        }
                        return {message: 'Order already confirmed', status: 400, RspCode: 2};
                    }
                    return {message: 'Invalid amount', status: 400, RspCode: 4};
                }
                return {message: 'Order not found', status: 400, RspCode: 1};
            }
            return {message: 'Invalid signature', status: 400, RspCode: 97};
        }
        return {message: 'Unknow error', status: 400, RspCode: 99};
    }
}


