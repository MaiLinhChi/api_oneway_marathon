
const Joi                       = require('joi');
const Manager                   = require('../manager/PaymentMethod');
const Response                  = require('./response').setup(Manager);

module.exports = {
    deleteById: {
        tags: ['api', 'Payment method'],
        description: 'Delete payment method by id',
        handler: (req, res) => {
            return Response(req, res, 'deleteById')
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
            }),
        }
    },
    putById: {
        tags: ['api', 'Payment method'],
        description: 'Update payment method By id',
        handler: (req, res) => {
            return Response(req, res, 'putById');
        },
        auth: {
            strategy: 'jwt',
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            params: Joi.object({
                id: Joi.string().required(),
            }),
            payload: Joi.object({
                gateway: Joi.string().optional(),
                bankCode: Joi.string().optional(),
                fee: Joi.number().optional(),
                name: Joi.string().optional(),
                feePercent: Joi.number().optional(),
                isDefault: Joi.boolean().optional(),
                status: Joi.string().valid("pending", "active", "inactive").optional(),
            })
        }
    },
    getById: {
        tags: ['api', 'Payment method'],
        description: 'Get payment method by id',
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
        tags: ['api', 'Payment method'],
        description: 'Get list payment method',
        handler: (req, res) => {
            return Response(req, res, 'get');
        },
        validate: {
            query: Joi.object({
                keyword: Joi.string().allow(''),
                gateway: Joi.string().optional(),
                name: Joi.string().optional(),
                fee: Joi.number().optional(),
                feePercent: Joi.number().optional(),
                isDefault: Joi.boolean().valid(false, true).optional(),
                status: Joi.string().valid("pending", "active", "deactive").optional(),
                pageSize: Joi.number().default(20),
                pageIndex: Joi.number().default(1),
            })
        }
    },
    post: {
        tags: ['api', 'Payment method'],
        description: 'Create payment',
        handler: (req, res) => {
            return Response(req, res, 'post');
        },
        auth: {
            strategy: 'jwt',
        },
        validate: {
            payload: Joi.object({
                gateway: Joi.string().required(),
                bankCode: Joi.string().required(),
                fee: Joi.number().required(),
                name: Joi.string().required(),
                feePercent: Joi.number().required(),
                isDefault: Joi.boolean().valid(false, true).optional(),
            }),
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
        }
    },
}