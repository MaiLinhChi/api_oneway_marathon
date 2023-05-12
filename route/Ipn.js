const Joi = require("joi");
const Manager = require("../manager/VNPIPN");
const Response = require("./response").setup(Manager);

module.exports = {
  getById: {
    tags: ['api', 'Ipn'],
    description: 'get ipn by id',
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
  getIpn: {
    tags: ["api", "Ipn"],
    description: "get ipn",
    handler: (req, res) => {
      return Response(req, res, "getIpn");
    },
  },
  get: {
    tags: ["api", "Ipn"],
    description: "Get list Ipns",
    handler: (req, res) => {
      return Response(req, res, "get");
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
        txnRef: Joi.string(),
        status: Joi.string().valid("active", "deactive"),
        fromDate: Joi.string().optional(),
        toDate: Joi.string().optional(),
        pageSize : Joi.number().default(20),
        pageIndex: Joi.number().default(1),
        sort: Joi.number().valid("desc", "asc"),
      }),
    },
  },
  deleteById: {
    tags: ['api', 'Ipn'],
    description: 'Delete ipn by id',
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
};
