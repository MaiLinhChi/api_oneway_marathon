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
                clubName: Joi.string(),
                pageSize: Joi.number().default(20),
                pageIndex: Joi.number().default(1),
                sort: Joi.number().valid('desc', 'asc')
            })
        }
    },
    update: {
        tags: ['api', 'Club'],
        description: 'update club',
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            params: Joi.object({
                id: Joi.string().required()
            }),
            payload: Joi.object({
                clubName: Joi.string(),
            })
        },
        handler: (req, res) => {
            return Response(req, res, 'update');
        },
    },
    post: {
        tags: ['api', 'Club'],
        description: 'post new club',
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            payload: Joi.object({
                clubName: Joi.string(),
            })
        },
        handler: (req, res) => {
            return Response(req, res, 'post');
        },
    },
    delete: {
        tags: ['api', 'Club'],
        description: 'delete store',
        handler: (req, res) => {
            return Response(req, res, 'delete');
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
                id: Joi.string().required()
            })
        }
    }
}