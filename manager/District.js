
"use strict";
const Model = require('../model/District');

module.exports = {
    getById: (req) => {
        return Model.findOne({_id: req.params.id}).then(data => {
            return {
                data
            }
        })
    },
    get: (req) => {
        const options = {}
        const skip = req.query.skip || 0
        const limit = 1000
        const sort = req.query.sort || 'desc'
        if(req.query.provinceId) options.provinceId = req.query.provinceId
        if(req.query.name) options.name = { $regex: new RegExp(req.query.name) }
        if(req.query.level) options.level = { $regex: new RegExp(req.query.level) }
        return Model.find(options).limit(limit).skip(skip * limit).sort({
            _id: sort
        }).then(rs => {
            return {
                status: true,
                messages: `get all district by provinceId: ${req.query.provinceId} successfully`,
                data: rs
            }
        })
    }
}


