
const Joi                       = require('joi');
const Manager                   = require('../manager/Bib');
const Response                  = require('./response').setup(Manager);

module.exports = {
    putById: {
        tags: ['api', 'Bib'],
        description: 'Update Bib By id',
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
                price: Joi.number().optional(),
                status: Joi.string().valid('pending', 'processing', 'confirmed').optional(),
                bib: Joi.string().optional(),
            })
        }
    },
    getById: {
        tags: ['api', 'Bib'],
        description: 'get bib by id',
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
        tags: ['api', 'Bib'],
        description: 'Get list bib',
        handler: (req, res) => {
            return Response(req, res, 'get');
        },
        auth: {
            strategy: 'jwt',
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            query: Joi.object({
                keyword: Joi.string().optional(),
                email: Joi.string().optional(),
                marathon: Joi.string().optional(),
                status: Joi.string().valid('pending', 'processing', 'confirmed').optional(),
                price: Joi.string().optional(),
                fromDate: Joi.string().optional(),
                toDate: Joi.string().optional(),
                limit: Joi.number().default(20),
                skip: Joi.number().default(0),
                sort: Joi.number().valid('desc', 'asc')
            })
        }
    },
    post: {
        tags: ['api', 'Bib'],
        description: 'Create bib',
        handler: (req, res) => {
            return Response(req, res, 'post');
        },
        auth: {
            strategy: 'jwt',
        },
        validate: {
            payload: Joi.object({
                email: Joi.string().required(),
                marathon: Joi.string().required(),
                price: Joi.number().required(),
                state: Joi.string().required(),
                distance: Joi.number().required(),
                fullName: Joi.string().required(),
                birthday: Joi.string().required(),
                gender: Joi.string().valid('male', 'female').required(),
                nationality: Joi.string().required(),
                passport: Joi.string().required(),
                phone: Joi.string().required(),
                address: Joi.string().required(),
                emergencyContactName: Joi.string().required(),
                emergencyContactPhone: Joi.string().required(),
                shirtSize: Joi.string().required(),
                nameBib: Joi.string().required(),
                timeEstimation: Joi.string().required(),
            }),
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
        }
    },
}