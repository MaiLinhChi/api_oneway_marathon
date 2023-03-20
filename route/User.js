const {verifyCredentialsAdmin, verifyCredentials }       = require('../utils/userFunctions');
const createToken               = require('../utils/token');
const Joi                       = require('joi');
const Manager                   = require('../manager/User');
const Response                  = require('./response').setup(Manager);

module.exports = {
    getById: {
        tags: ['api', 'Users'],
        description: 'get user by id',
        handler: (req, res) => {
            return Response(req, res, 'getById')
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
    get: {
        tags: ['api', 'Users'],
        description: 'Get list users',
        handler: (req, res) => {
            return Response(req, res, 'get');
        },
        auth: {
            strategy: 'jwt',
            scope: ['admin']
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
            query: Joi.object({
                keyword: Joi.string().allow(''),
                status: Joi.string().valid('success', 'reject', 'pending'),
                Name: Joi.string().optional().allow(''),
                UserName: Joi.string().optional().allow(''),
                PhoneNumber: Joi.string().allow(''),
                Email: Joi.string().email().allow(''),
                fromDate: Joi.string().optional().allow(''),
                toDate: Joi.string().optional().allow(''),
                pageSize: Joi.number().default(20),
                pageIndex: Joi.number().default(1),
                sort: Joi.number().valid('desc', 'asc')
            })
        }
    },
    getMe: {
        tags: ['api', 'General'],
        description: 'Get user info',
        handler: (req, res) => {
            return Response(req, res, 'getMe');
        },
        auth: {
            strategy: 'jwt'
        },
        validate: {
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
        }
    },
    post: {
        tags: ['api', 'Users'],
        description: 'User Register',
        handler: (req, res) => {
            return Response(req, res, 'post');
        },
        validate: {
            payload: Joi.object({
                email: Joi.string().required().email(),
                username: Joi.string().min(8),
                password: Joi.string().min(8).required(),
                fullname: Joi.string(),
                mobile: Joi.string(),
                avatar: Joi.string(),
            })
        }
    },
    putById: {
        tags: ['api', 'Users'],
        description: 'Update user By id',
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
                fullname: Joi.string(),
                mobile: Joi.string(),
                avatar: Joi.string(),
            })
        }
    },
    postAuthenticate: {
        tags: ['api', 'Users'],
        description: 'Authenticate',
        pre: [
            { method: verifyCredentials, assign: 'user' }
        ],
        handler: (req, res) => {
            if(req.pre.user.statusCode) return res.response(req.pre.user).code(req.pre.user.statusCode)
            Reflect.deleteProperty(req.pre.user, 'password');
            return res.response({ token: createToken(req.pre.user) }).code(200);
        },
        validate: {
            payload: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            })
        }
    },
    postPasswordForgot: {
        tags: ['api', 'Users'],
        description: 'request OTP for forgot password',
        handler: (req, res) => {
            return Response(req, res, 'postPasswordForgot');
        },
        validate: {
            payload: Joi.object({
                email: Joi.string().required().email(),
            })
        }
    },
    putPasswordForgot: {
        tags: ['api', 'Users'],
        description: 'submit OTP forgot password',
        handler: (req, res) => {
            return Response(req, res, 'putPasswordForgot');
        },
        validate: {
            payload: Joi.object({
                code: Joi.string().required(),
                email: Joi.string().required().email(),
                password: Joi.string().required(),
            })
        }
    },
    postAuthenticateAdmin: {
        tags: ['api', 'Admin'],
        description: 'Authenticate',
        pre: [
            { method: verifyCredentialsAdmin, assign: 'user' }
        ],
        handler: (req, res) => {
            if(req.pre.user.statusCode) return res.response(req.pre.user).code(req.pre.user.statusCode)
            Reflect.deleteProperty(req.pre.user, 'password');
            return res.response({ token: createToken(req.pre.user) }).code(200);
        },
        validate: {
            payload: Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            })
        }
    },
    putPassword: {
        tags: ['api', 'General'],
        description: 'Change password',
        auth: {
            strategy: 'jwt',
        },
        validate: {
            payload: Joi.object({
                oldPassword: Joi.string().required(),
                newPassword: Joi.string().required()
            }),
            headers: Joi.object({
                authorization: Joi.string().required()
            }).options({allowUnknown: true}),
        },
        handler: (req, res) => {
            return Response(req, res, 'putPassword');
        },
    },
}