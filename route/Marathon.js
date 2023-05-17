
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
            // headers: Joi.object({
            //     authorization: Joi.string().required()
            // }).options({allowUnknown: true}),
            params: Joi.object({
                id: Joi.string().required(),
            }),
            payload: Joi.object({
                name: Joi.string().optional(),
                image: Joi.string().optional(),
                imageEmail: Joi.string().optional(),
                location: Joi.string().optional(),
                type: Joi.string().default('Road/City trail').optional(),
                description: Joi.string().optional(),
                status: Joi.string().valid('active', 'inactive').optional(),
                startTime: Joi.string().optional(),
                race: Joi.array().min(1).items(Joi.object({
                    image: Joi.string().optional(),
                    distance: Joi.number().optional().description('race track length in kilomets'),
                    unit: Joi.string().optional(),
                    routeMap: Joi.string().optional().description('image router map'),
                    award: Joi.object({
                        male: Joi.number().min(1000).optional().description('award on vnd'),
                        female: Joi.number().min(1000).optional().description('award on vnd'),
                    }),
                })).optional(),
                priceList: Joi.array().min(1).items(Joi.object({
                    name: Joi.string().optional(),
                    startSell: Joi.string().optional(),
                    endSell: Joi.string().optional(),
                    individual: Joi.array().min(1).items(Joi.object({
                        distance: Joi.number().optional(),
                        price: Joi.number().min(1000).optional().description('price tiket on vnd'),
                        _id: Joi.string().optional(),
                    })).optional(),
                    _id: Joi.string().optional(),
                })).optional(),
                registerGroup: Joi.array().min(1).items(Joi.object({
                    numberPerson: Joi.object({
                        from: Joi.number(),
                        to: Joi.number(),
                    }).optional(),
                    percent: Joi.number().optional(),
                    _id: Joi.string().optional(),
                })).optional(),
                raceKit: Joi.array().min(1).max(4).items(Joi.object({
                    image: Joi.string().optional(),
                    _id: Joi.string().optional(),
                })).optional(),
                service: Joi.object({
                    image: Joi.string().optional(),
                    description: Joi.string().optional(),
                }).optional(),
                schedule: Joi.array().min(1).items(Joi.object({
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                    detail: Joi.array().min(1).items(Joi.object({
                        time: Joi.string().optional().optional(),
                        description: Joi.string().optional().optional(),
                        _id: Joi.string().optional(),
                    })),
                    _id: Joi.string().optional(),
                })).optional(),
                regulation: Joi.array().min(1).items(Joi.object({
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                    _id: Joi.string().optional(),
                })).optional(),
            })
        }
    },
    getById: {
        tags: ['api', 'Marathon'],
        description: 'get marathon by id',
        handler: (req, res) => {
            return Response(req, res, 'getById')
        },
        // auth: {
        //     strategy: 'jwt',
        // },
        validate: {
            // headers: Joi.object({
            //     authorization: Joi.string().required()
            // }).options({allowUnknown: true}),
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
        // auth: {
        //     strategy: 'jwt'
        // },
        validate: {
            // headers: Joi.object({
            //     authorization: Joi.string().required()
            // }).options({allowUnknown: true}),
            query: Joi.object({
                name: Joi.string(),
                status: Joi.string().valid('active', 'deactive'),
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
                image: Joi.string().required(),
                imageEmail: Joi.string().required(),
                description: Joi.string().required(),
                startTime: Joi.string().required(),
                location: Joi.string().required(),
                type: Joi.string().default('Road/City trail').required(),
                race: Joi.array().min(1).items(Joi.object({
                    image: Joi.string().required(),
                    distance: Joi.number().required().description('race track length in kilomets'),
                    unit: Joi.string().required(),
                    routeMap: Joi.string().required().description('image router map'),
                    award: Joi.object({
                        male: Joi.number().min(1000).required().description('award on vnd'),
                        female: Joi.number().min(1000).required().description('award on vnd'),
                    }),
                })).required(),
                priceList: Joi.array().min(1).items(Joi.object({
                    name: Joi.string().required(),
                    startSell: Joi.string().required(),
                    endSell: Joi.string().required(),
                    individual: Joi.array().min(1).items(Joi.object({
                        distance: Joi.number().required(),
                        price: Joi.number().min(1000).required().description('price tiket on vnd'),
                    })).required(),
                })).required(),
                registerGroup: Joi.array().min(1).items(Joi.object({
                    numberPerson: Joi.object({
                        from: Joi.number(),
                        to: Joi.number(),
                    }),
                    percent: Joi.string().required(),
                })),
                raceKit: Joi.array().min(1).max(4).items(Joi.object({
                    image: Joi.string().required(),
                })).optional(),
                service: Joi.object({
                    image: Joi.string().required(),
                    description: Joi.string().required(),
                }),
                schedule: Joi.array().min(1).items(Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().required(),
                    detail: Joi.array().min(1).items(Joi.object({
                        time: Joi.string().required(),
                        description: Joi.string().required(),
                    })),
                })),
                regulation: Joi.array().min(1).items(Joi.object({
                    title: Joi.string().required(),
                    description: Joi.string().required(),
                    _id: Joi.string().optional(),
                })).required(),
            }),
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
        }
    },
}