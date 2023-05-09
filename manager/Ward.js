
"use strict";

const Model = require('../model/Ward');

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
        if(req.query.districtId) options.districtId = req.query.districtId
        if(req.query.name) options.name = { $regex: new RegExp(req.query.name), $options: 'i' }
        if(req.query.level) options.level = { $regex: new RegExp(req.query.level), $options: 'i' }
        return Model.find(options).limit(limit).skip(skip * limit).sort({
            _id: sort
        }).then(rs => {
            return {
                status: true,
                messages: `get all ward by districtId: ${req.query.districtId} successfully`,
                data: rs
            }
        })
    }
}


