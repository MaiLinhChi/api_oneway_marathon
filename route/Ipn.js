const Joi = require("joi");
const Manager = require("../manager/VNPIPN");
const Response = require("./response").setup(Manager);

module.exports = {
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
    // auth: {
    //     strategy: 'jwt'
    // },
    validate: {
      // headers: Joi.object({
      //     authorization: Joi.string().required()
      // }).options({allowUnknown: true}),
      query: Joi.object({
        txnRef: Joi.string(),
        status: Joi.string().valid("active", "deactive"),
        fromDate: Joi.string().optional(),
        toDate: Joi.string().optional(),
        limit: Joi.number().default(20),
        skip: Joi.number().default(0),
        sort: Joi.number().valid("desc", "asc"),
      }),
    },
  },
  deleteById: {
    tags: ["api", "Ipn"],
    description: "Delete Ipn by id",
    handler: (req, res) => {
      return Response(req, res, "deleteById");
    },
    validate: {
      params: Joi.object({
        id: Joi.string().required(),
      }),
    },
  },
};
