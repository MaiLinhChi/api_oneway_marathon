const Joi                       = require('joi');
const Manager                   = require('../manager/Club');
const Response                  = require('./response').setup(Manager);

module.exports = {
    getById: {
        tags: ['api', 'Club'],
        description: 'get district id',
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
        tags: ['api', 'Club'],
        description: 'Get list club',
        handler: (req, res) => {
            return Response(req, res, 'get');
        },
        validate: {
            query: Joi.object({
                name: Joi.string(),
                pageSize: Joi.number().default(20),
                pageIndex: Joi.number().default(1),
                sort: Joi.number().valid('desc', 'asc')
            })
        }
    },
}