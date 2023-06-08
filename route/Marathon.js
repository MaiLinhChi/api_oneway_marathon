
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
                name: Joi.string().optional(),
                image: Joi.string().optional(),
                imageEmail: Joi.string().optional(),
                description: Joi.string().optional(),
                startTime: Joi.string().optional(),
                status: Joi.string().optional(),
                location: Joi.string().optional(),
                type: Joi.string().optional().default('Road/City trail'),
                unitRace: Joi.string().optional(),
                race: Joi.array().min(1).items(Joi.object({
                    image: Joi.string().optional(),
                    distance: Joi.number().optional().description('race track length in kilomets'),
                    routeMap: Joi.string().optional().description('image router map'),
                    award: Joi.object({
                        male: Joi.number().optional().description('award on vnd'),
                        female: Joi.number().optional().description('award on vnd'),
                    }),
                    _id: Joi.string().optional(),
                })),
                priceList: Joi.array().min(1).items(Joi.object({
                    name: Joi.string().optional(),
                    startSell: Joi.string().optional(),
                    endSell: Joi.string().optional(),
                    individual: Joi.array().min(1).items(Joi.object({
                        distance: Joi.number().optional(),
                        price: Joi.number().optional(),
                        _id: Joi.string().optional(),
                    })),
                    _id: Joi.string().optional(),
                })),
                registerGroup: Joi.array().min(1).items(Joi.object({
                    numberPerson: Joi.object({
                        from: Joi.number().optional(),
                        to: Joi.number().optional(),
                    }),
                    percent: Joi.number().optional(),
                    _id: Joi.string().optional(),
                })),
                raceKit: Joi.array().min(1).max(4).items(Joi.object({
                    image: Joi.string().optional(),
                })),
                service: Joi.object({
                    image: Joi.string().optional(),
                    description: Joi.string().optional(),
                }),
                schedule: Joi.array().min(1).items(Joi.object({
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                    detail: Joi.array().min(1).items(Joi.object({
                        time: Joi.string().optional(),
                        description: Joi.string().optional(),
                        _id: Joi.string().optional(),
                    })),
                    _id: Joi.string().optional(),
                })),
                regulation: Joi.array().min(1).items(Joi.object({
                    title: Joi.string().optional(),
                    description: Joi.string().optional(),
                    _id: Joi.string().optional(),
                })),
            }),
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
                    distance: Joi.number().description('race track length in kilomets'),
                    routeMap: Joi.string().description('image router map'),
                    award: Joi.object({
                        male: Joi.number().description('award on vnd'),
                        female: Joi.number().description('award on vnd'),
                    }),
                })),
                priceList: Joi.array().min(1).items(Joi.object({
                    name: Joi.string(),
                    startSell: Joi.string(),
                    endSell: Joi.string(),
                    individual: Joi.array().min(1).items(Joi.object({
                        distance: Joi.number(),
                        price: Joi.number(),
                    })),
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
                    detail: Joi.array().min(1).items(Joi.object({
                        time: Joi.string(),
                        description: Joi.string(),
                    })),
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