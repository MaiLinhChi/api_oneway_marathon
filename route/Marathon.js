
const Joi                       = require('joi');
const Manager                   = require('../manager/Marathon');
const Response                  = require('./response').setup(Manager);

module.exports = {
    get: {
        tags: ['api', 'Marathon'],
        description: 'Get list marathons',
        handler: (req, res) => {
            return Response(req, res, 'get');
        },
        auth: {
            strategy: 'jwt'
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            query: Joi.object({
                name: Joi.string(),
                status: Joi.string().valid('success', 'reject', 'pending'),
                fromDate: Joi.string().optional(),
                toDate: Joi.string().optional(),
                limit: Joi.number().default(20),
                skip: Joi.number().default(0),
                sort: Joi.number().valid('desc', 'asc')
            })
        }
    },
    post: {
        tags: ['api', 'Marathon'],
        description: 'Create Marathon',
        handler: (req, res) => {
            return Response(req, res, 'post');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        },
        validate: {
            payload: Joi.object({
                name: Joi.string().required(),
                description: Joi.string().required(),
                startTime: Joi.string().required(),
            }),
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
        }
    },
}