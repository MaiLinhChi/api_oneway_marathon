
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
                unitRace: Joi.string().optional(),
                race: Joi.array().min(1).items(Joi.object({
                    image: Joi.string().optional(),
                    distance: Joi.number().optional().description('race track length in kilomets'),
                    routeMap: Joi.string().optional().description('image router map'),
                    award: Joi.object({
                        male: Joi.number().min(1000).optional().description('award on vnd'),
                        female: Joi.number().min(1000).optional().description('award on vnd'),
                    }),
                    _id: Joi.string().optional(),
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
                name: Joi.string(),
                image: Joi.string(),
                imageEmail: Joi.string(),
                description: Joi.string(),
                startTime: Joi.string(),
                location: Joi.string(),
                type: Joi.string().default('Road/City trail'),
                unitRace: Joi.string(),
                race: Joi.array().min(1).items(Joi.object({
                    image: Joi.string(),
                    distance: Joi.string().description('race track length in kilomets'),
                    routeMap: Joi.string().description('image router map'),
                    award: Joi.object({
                        male: Joi.string().description('award on vnd'),
                        female: Joi.string().description('award on vnd'),
                    }),
                })),
                priceList: Joi.array().min(1).items(Joi.object({
                    name: Joi.string(),
                    startSell: Joi.string(),
                    endSell: Joi.string(),
                    individual: Joi.object({
                        distance: Joi.string(),
                        price: Joi.string().description('price tiket on vnd'),
                    }),
                })),
                registerGroup: Joi.array().min(1).items(Joi.object({
                    numberPerson: Joi.object({
                        from: Joi.string(),
                        to: Joi.string(),
                    }),
                    percent: Joi.string(),
                })),
                raceKit: Joi.array().min(1).max(4).items(Joi.object({
                    image: Joi.string(),
                })),
                service: Joi.object({
                    image: Joi.string(),
                    description: Joi.string(),
                }),
                schedule: Joi.array().min(1).items(Joi.object({
                    title: Joi.string(),
                    description: Joi.string(),
                    detail: Joi.object({
                        time: Joi.string(),
                        description: Joi.string(),
                    }),
                })),
                regulation: Joi.array().min(1).items(Joi.object({
                    title: Joi.string(),
                    description: Joi.string(),
                })),
            }),
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
        }
    },
}