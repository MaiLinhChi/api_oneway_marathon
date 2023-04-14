const moment = require('moment')
const rp = require('request-promise')
const crypto = require('crypto')
const querystring = require('qs')

const momo = async (env,amount, code, url) => {
    const momoUrl = {
        pro: 'https://payment.momo.vn',
        dev: 'https://test-payment.momo.vn'
    }
    const partnerCode = process.env.MOMO_PARTNER_CODE
    const accessKey = process.env.MOMO_ACCESS_KEY
    const serectkey = process.env.MOMO_SECRET_KEY
    const orderInfo = "Thanh toan don hang #" + code;
    const returnUrl = "shopdi://shopdi.io/data/" + code;
    const notifyurl = url ? url : "http://frontend-stag.shopdi.io/api/v1/redirects/momo_return";
    const amounts = amount.toString();
    const extraData = "";
    const requestId = moment().unix().toString()
    const orderId = code + '_' + requestId;
    const rawHash = "accessKey=" + accessKey +
        "&amount=" + amounts +
        "&extraData=" + extraData +
        "&ipnUrl=" + notifyurl +
        "&orderId=" + orderId +
        "&orderInfo=" + orderInfo +
        "&partnerCode=" + partnerCode +
        "&redirectUrl=" + returnUrl +
        "&requestId=" + requestId +
        "&requestType=captureWallet"
    // const signature = sha256(rawHash)
    const signature = crypto.createHmac('sha256', serectkey).update(rawHash).digest('hex');
    const body = {
        partnerCode,
        requestId,
        amount,
        orderId,
        orderInfo,
        "redirectUrl": returnUrl,
        "ipnUrl": notifyurl,
        "requestType": "captureWallet",
        extraData,
        lang:  "vi",
        signature
      }
    const opts = {
        method: 'POST',
        uri:  momoUrl[env]+'/v2/gateway/api/create',
        headers:{
            "Content-Type": "application/json; charset=UTF-8"
        },
        body,
        json: true
    }
    try{
        const res = await rp(opts)
        // console.log({res})
        return res
    }catch(error){
        console.log(error.message)
        return false
    }
}

const sortObject = (obj) => {
    const sorted = {};
    const str = [];
    let key;
    for (key in obj){
        if (key) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

const vnpayPaymentMethod = (env, method, amount, code, ip) => {
    const vnpayUrl = {
        pro: 'https://vnpayment.vn',
        dev: 'https://sandbox.vnpayment.vn'
    }
    const secretKey = process.env.VNPAY_SECRET_KEY
    let vnp_Params = {
        vnp_Version: process.env.VNPAY_VERSION,
        vnp_Command: process.env.VNPAY_COMMAND,
        vnp_TmnCode: process.env.VNPAY_TMN_CODE,
        vnp_Amount: amount * 100,
        vnp_CreateDate: moment().format('YYYYMMDDHHmmss'),
        vnp_CurrCode: 'VND',
        vnp_IpAddr: ip,
        vnp_Locale: 'vn',
        vnp_OrderInfo: "Thanh toan hoa don " + code + " so tien: " + amount,
        vnp_OrderType: 'other',
        vnp_ReturnUrl: "https://dev.oneway.run/data/" + code,
        vnp_TxnRef: code + '_' + moment().format('DDHHmmss'),
        vnp_BankCode: method
    }
    vnp_Params = sortObject(vnp_Params)
    const signData = querystring.stringify(vnp_Params, { encode: false })
    const hmac = crypto.createHmac("sha512", secretKey);
    const signed = hmac.update(signData, 'utf-8').digest("hex")
    vnp_Params.vnp_SecureHash = signed
    const opts = {
        uri:  vnpayUrl[env]+'/paymentv2/vpcpay.html?' + querystring.stringify(vnp_Params, { encode: false }),
        vnp_TxnRef: vnp_Params.vnp_TxnRef
    }
    // console.log(opts)
    return opts
}

// vnpayPaymentMethod('dev', 'VNPAYQR', 1000, moment().format('DDHHmmss'), '127.0.0.1')
// vnpayPaymentMethod('dev', 'VNBANK', 10000, moment().format('DDHHmmss'), '127.0.0.1')
// vnpayPaymentMethod('dev', 'VNMART', 1000, moment().format('DDHHmmss'), '127.0.0.1')
// vnpayPaymentMethod('dev', 'INTCARD', 1000, moment().format('DDHHmmss'), '127.0.0.1')

const momoATMNoiDiaPaymentMethod = async (env, amount, code, url) => {
    const momoUrl = {
        pro: 'https://payment.momo.vn',
        dev: 'https://test-payment.momo.vn'
    }
    const partnerCode = process.env.MOMO_PARTNER_CODE
    const accessKey = process.env.MOMO_ACCESS_KEY
    const serectkey = process.env.MOMO_SECRET_KEY
    const orderInfo = "Thanh toan don hang #" + code;
    const returnUrl = "shopdi://shopdi.io/data/" + code;
    const notifyurl = url ? url : "http://frontend-stag.shopdi.io/api/v1/redirects/momo_return";
    const amounts = amount.toString();
    const extraData = "";
    const requestId = moment().unix().toString()
    const orderId = code + '_' + requestId;
    const rawHash = "accessKey=" + accessKey +
        "&amount=" + amounts +
        "&extraData=" + extraData +
        "&ipnUrl=" + notifyurl +
        "&orderId=" + orderId +
        "&orderInfo=" + orderInfo +
        "&partnerCode=" + partnerCode +
        "&redirectUrl=" + returnUrl +
        "&requestId=" + requestId +
        "&requestType=captureWallet"
    // const signature = sha256(rawHash)
    const signature = crypto.createHmac('sha256', serectkey).update(rawHash).digest('hex');
    const body = {
        partnerCode,
        requestId,
        amount,
        orderId,
        orderInfo,
        "redirectUrl": returnUrl,
        "ipnUrl": notifyurl,
        "requestType": "captureWallet",
        extraData,
        lang:  "vi",
        signature
    }
    const opts = {
        method: 'POST',
        uri:  momoUrl[env]+'/v2/gateway/api/create',
        headers:{
            "Content-Type": "application/json; charset=UTF-8"
        },
        body,
        json: true
    }
    try{
        const res = await rp(opts)
        // console.log({res})
        return res
    }catch(error){
        console.log(error.message)
        return false
    }
}
module.exports = {
    momoPaymentMethod: (env,amount, code, url) => {
        return momo(env, amount, code, url)
    },
    vnpayPaymentMethod: (env, method, amount, code, url, ip) => {
        return vnpayPaymentMethod(env, method, amount, code, url, ip)
    }
}
