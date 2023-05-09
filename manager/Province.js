
"use strict";

const Model = require('../model/Province');

module.exports = {
    getById: (req) => {
        return Model.findOne({_id: req.params.id}).then(data => {
            return {
                data
            }
        })
    },
    get: async(req) => {
        const options = {}
        const skip = req.query.skip || 0
        const sort = req.query.sort || 'desc'
        const total = await Model.count();
        if(req.query.name) options.name = { $regex: new RegExp(req.query.name), $options: 'i' }
        if(req.query.level) options.level = { $regex: new RegExp(req.query.level), $options: 'i' }
        return Model.find(options).limit(total).skip(skip * total).sort({
            _id: sort
        }).then((rs) => {
            return {
                status: true,
                messages: "get all provinces successfully",
                data: rs
            }
        })
    },
}


