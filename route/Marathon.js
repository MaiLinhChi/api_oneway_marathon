
const Joi                       = require('joi');
const Manager                   = require('../manager/Marathon');
const Response                  = require('./response').setup(Manager);

module.exports = {
    putById: {
        tags: ['api', 'Marathon'],
        description: 'Update marathon By id',
        handler: (req, res) => {
            return Response(req, res, 'putById');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            params: Joi.object({
                id: Joi.string().required(),
            }),
            payload: Joi.object({
                description: Joi.string(),
                race: Joi.string(),
                status: Joi.string().valid('active', 'deactive'),
                startTime: Joi.string(),
            })
        }
    },
    getById: {
        tags: ['api', 'Marathon'],
        description: 'get marathon by id',
        handler: (req, res) => {
            return Response(req, res, 'getById')
        },
        auth: {
            strategy: 'jwt',
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            params: Joi.object({
                id: Joi.string().required()
            }),
        }
    },
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
                location: Joi.string().required(),
                type: Joi.string().default('Road/City trail').required(),
                race: Joi.array().min(1).items(Joi.object({
                    name: Joi.string().required(),
                    distance: Joi.number().required().description('race track length in meters'),
                    routeMap: Joi.string().required().description('image router map'),
                    award: Joi.object({
                        male: Joi.number().min(1000).required().description('award on vnd'),
                        female: Joi.number().min(1000).required().description('award on vnd'),
                    }),
                    price: Joi.array().min(1).items(Joi.object({
                        name: Joi.string().required(),
                        startSell: Joi.string().required(),
                        individual: Joi.number().min(1000).required().description('price tiket on vnd'),
                        group: Joi.number().min(1000).required().description('award on vnd'),
                    }))
                })).required(),
            }),
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
        }
    },
}