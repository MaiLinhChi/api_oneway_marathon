"use strict";

const IpnModel = require("../model/VNPIPN");
const BibModel = require("../model/Bib");
const moment = require("moment");
const { sortObject } = require("../utils/payment");
const querystring = require("qs");
const crypto = require("crypto");
const { default: mongoose } = require("mongoose");

module.exports = {
  getIpn: async (req) => {
    let query = { ...req.query };
    query = sortObject(query);
    Reflect.deleteProperty(query, "vnp_SecureHash");
    const secretKey = process.env.VNPAY_SECRET_KEY;
    const signData = querystring.stringify(query, { encode: false });
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData, "utf-8").digest("hex");
    const paymentedModel = await BibModel.findOne({
      txnRef: req.query.vnp_TxnRef,
    });
    if (!paymentedModel) {
      return { message: "Order not found", status: 400, RspCode: 1 };
    }
    if (paymentedModel.price * 100 != req.query.vnp_Amount) {
      return { message: "Invalid amount", status: 400, RspCode: 4 };
    }
    if (paymentedModel.status === "comfirmed") {
      return { message: "Order already confirmed", status: 400, RspCode: 2 };
    }
    if (req.query.vnp_SecureHash !== signed) {
      return { message: "Invalid signature", status: 400, RspCode: 97 };
    }
    const model = new IpnModel({
      txnRef: req.query.vnp_TxnRef,
      status: req.query.vnp_TransactionStatus == "00" ? "success" : "error",
      data: req.query,
    });
    const ipn = await model.save();
    const bib = await paymentedModel.updateOne({ status: "comfirmed" });
    if (!bib || !ipn) {
      return { message: "Unknow error", status: 400, RspCode: 99 };
    }
    return { message: "Confirm Success", status: 400, RspCode: 0 };
  },
  get: (req) => {
    const { txnRef, status, fromDate, toDate } = req.query;
    const options = {};
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 20;
    const sort = req.query.sort || "desc";

    if (status) options.status = status;
    if (txnRef)
      options.txnRef = { $regex: new RegExp(req.query.txnRef), $options: "i" };
    if (fromDate && toDate)
      options.startTime = { $gte: fromDate, $lte: toDate };
    return IpnModel.find({ $and: [options] }).limit(limit).skip(skip * limit).sort({
        createdAt: sort,
      }).then(async (rs) => {
        const totalRecord = await IpnModel.countDocuments(options);

        return {
          data: rs,
          totalRecord,
          totalPage: Math.ceil(totalRecord / limit),
        };
      });
  },
  deleteById: async (req) => {
    const { id } = req.params;
    try {
      if (!mongoose.Types.ObjectId.isValid(id))
        return { message: `No brand with id: ${id}`, statusCode: 404 };
      const ins = await IpnModel.findByIdAndDelete({ _id: id });
      if (!ins)
        return {
          message: "Not found brand",
          status: false,
          statusCode: 404,
          messageKey: "brand_not_found",
          data: ins,
        };
      return {
        message: "success",
        data: ins,
        statusCode: 200,
        messageKey: "delete_brand_success",
      };
    } catch (error) {
      return error;
    }
  },
};
