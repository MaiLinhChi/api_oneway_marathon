
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
        validate: {
            params: Joi.object({
                id: Joi.string().required(),
            }),
            payload: Joi.object({
                groupId: Joi.string().optional(),
                email: Joi.string().required(),
                marathon: Joi.object({
                    marathonId: Joi.string(),
                    distance: Joi.number(),
                    state: Joi.string(),
                    unit: Joi.string()
                }),
                price: Joi.number().optional(),
                fullName: Joi.string().optional(),
                birthday: Joi.string().optional(),
                gender: Joi.string().valid('male', 'female').optional(),
                nationality: Joi.string().optional(),
                passport: Joi.string().optional(),
                phone: Joi.string().optional(),
                address: Joi.object({
                    province: Joi.string(),
                    district: Joi.string(),
                    ward: Joi.string(),
                    street: Joi.string(),
                }).optional(),
                emergencyContactName: Joi.string().optional(),
                emergencyContactPhone: Joi.string().optional(),
                shirtSize: Joi.string().optional(),
                nameBib: Joi.string().optional().allow(''),
                timeEstimation: Joi.string().optional(),
                vat: Joi.object({
                    taxCode: Joi.string(),
                    companyName: Joi.string(),
                    companyAddress: Joi.string()
                }).optional(),
                clubId: Joi.string().optional()
            })
        }
    },
    getById: {
        tags: ['api', 'Bib'],
        description: 'get bib by id',
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
                pageSize: Joi.number().default(20),
                pageIndex: Joi.number().default(1),
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
        validate: {
            payload: Joi.object({
                groupId: Joi.string().optional(),
                email: Joi.string().required(),
                marathon: Joi.object({
                    marathonId: Joi.string(),
                    distance: Joi.number(),
                    state: Joi.string(),
                    unit: Joi.string()
                }),
                price: Joi.number().required(),
                fullName: Joi.string().required(),
                birthday: Joi.string().required(),
                gender: Joi.string().valid('male', 'female').required(),
                nationality: Joi.string().required(),
                passport: Joi.string().required(),
                phone: Joi.string().required(),
                address: Joi.object({
                    province: Joi.string(),
                    district: Joi.string(),
                    ward: Joi.string(),
                    street: Joi.string(),
                }).optional(),
                emergencyContactName: Joi.string().required(),
                emergencyContactPhone: Joi.string().required(),
                shirtSize: Joi.string().required(),
                nameBib: Joi.string().optional().allow(''),
                timeEstimation: Joi.string().required(),
                vat: Joi.object({
                    taxCode: Joi.string(),
                    companyName: Joi.string(),
                    companyAddress: Joi.string()
                }).optional(),
                clubId: Joi.string().optional()
            }),
        }
    },
}