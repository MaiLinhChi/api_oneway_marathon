const Joi                       = require('joi');
const Manager                   = require('../manager/Ward');
const Response                  = require('./response').setup(Manager);

module.exports = {
    getById: {
        tags: ['api', 'General'],
        description: 'get ward by id',
        handler: (req, res) => {
            return Response(req, res, 'getById')
        },
        validate: {
            params: Joi.object({
                id: Joi.string().required()
            }),
        }
    },
    get: {
        tags: ['api', 'General'],
        description: 'Get list wards',
        handler: (req, res) => {
            return Response(req, res, 'get');
        },
        validate: {
            query: Joi.object({
                districtId: Joi.string().required(),
                name: Joi.string(),
                level: Joi.string(),
                limit: Joi.number().default(20),
                skip: Joi.number().default(0),
                sort: Joi.number().valid('desc', 'asc')
            })
        }
    },
}