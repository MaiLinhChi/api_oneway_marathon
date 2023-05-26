const Joi                       = require('joi');
const Manager                   = require('../manager/Order');
const Response                  = require('./response').setup(Manager);

module.exports = {
    getOrderById: {
        tags: ['api', 'Order'],
        description: 'Get order by id',
        handler: (req, res) => {
            return Response(req, res, 'getOrderById')
        },
        validate: {
            params: Joi.object({
                id: Joi.string().required()
            }),
        }
    },
    getOrders: {
        tags: ['api', 'Order'],
        description: 'Get list orders',
        handler: (req, res) => {
            return Response(req, res, 'getOrders');
        },
        validate: {
            query: Joi.object({
                groupId: Joi.string(),
                txnRef: Joi.string(),
                registerId: Joi.string(),
                status: Joi.string().valid('pending', 'processing', 'confirmed').optional(),
                pageSize: Joi.number().default(20),
                pageIndex: Joi.number().default(1),
                sort: Joi.number().valid('desc', 'asc')
            })
        }
    },
    updateOrderById: {
        tags: ['api', 'Order'],
        description: 'Update order by id',
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
                payment: Joi.object({
                    gateway: Joi.string(),
                    bankCode: Joi.string(),
                    fee: Joi.number()
                }),
            })
        },
        handler: (req, res) => {
            return Response(req, res, 'putOrderById');
        },
    },
    postOrder: {
        tags: ['api', 'Order'],
        description: 'Add order',
        validate: {
            payload: Joi.object({
                groupId: Joi.string().required(),
                products: Joi.array().items(Joi.object({
                    productId: Joi.string().required(),
                })).optional(),
                email: Joi.string().required().email(),
                payment: Joi.object({
                    gateway: Joi.string(),
                    bankCode: Joi.string(),
                    fee: Joi.number()
                }),
                total: Joi.number().required(),
            })
        },
        handler: (req, res) => {
            return Response(req, res, 'postOrder');
        },
    },
    deleteOrderById: {
        tags: ['api', 'Order'],
        description: 'Delete order by id',
        handler: (req, res) => {
            return Response(req, res, 'deleteOrderById');
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