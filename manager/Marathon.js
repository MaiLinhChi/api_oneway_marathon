
"use strict";

const Model = require('../model/Marathon')

module.exports = {
    putById: (req) => {
        return Model.findOneAndUpdate({_id: req.params.id}, req.payload, {new: true})
    },
    getById: (req) => {
        return Model.findOne({_id: req.params.id}).then(item => {
            return {
                message: "Get marathon detail successfully",
                data: item,
                status: 200
            }
        })
    },
    get:  (req) => {
        const {name, status, fromDate, toDate} = req.query
        const options = {}
        const skip =  req.query.skip || 0
        const limit = req.query.limit || 20
        const sort = req.query.sort || 'desc'

        if(status) options.status = status
        if(name) options.name = { $regex: new RegExp(req.query.name), $options: 'i' }
        if(fromDate && toDate) options.startTime = {$gte: fromDate, $lte: toDate}
        
        return Model.find({$and: [options]}).limit(limit).skip(skip * limit).sort({
            createdAt: sort
        }).then(async rs => {
            const totalRecord = await Model.countDocuments(options)
            
            return {
                data: rs,
                status: 200,
                message: "Get list marathons successfully",
                totalRecord,
                totalPage: Math.ceil(totalRecord / limit),
            }
        })
    },
    post: (req) => {
        const model = new Model({
            name: req.payload.name,
            image: req.payload.image,
            imageEmail: req.payload.imageEmail,
            description: req.payload.description,
            startTime: req.payload.startTime,
            type: req.payload.type,
            location: req.payload.location,
            race: req.payload.race,
            registerGroup: req.payload.registerGroup,
            raceKit: req.payload.raceKit,
            service: req.payload.service,
            schedule: req.payload.schedule,
            regulation: req.payload.regulation,
        })
        return model.save()
    },
}


