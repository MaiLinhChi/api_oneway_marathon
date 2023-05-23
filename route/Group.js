const Joi = require("joi");
const Manager = require("../manager/Group");
const Response = require("./response").setup(Manager);

module.exports = {
  putById: {
    tags: ['api', 'Group'],
    description: 'Update group By id',
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
            groupId: Joi.string().optional(),
            marathonId: Joi.string().optional(),
            groupName: Joi.string().optional(),
            password: Joi.string().optional(),
            fullName: Joi.string().optional(),
            email: Joi.string().optional(),
            phone: Joi.string().optional(),
            role: Joi.string().optional(),
            status: Joi.string().optional(),
        })
    }
  },
  getById: {
    tags: ['api', 'Group'],
    description: 'get group by id',
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
    tags: ["api", "Group"],
    description: "Get list Groups",
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
        marathonId: Joi.string().optional(),
        groupName: Joi.string().optional(),
        fullName: Joi.string().optional(),
        email: Joi.string().optional(),
        phone: Joi.string().optional(),
        role: Joi.string().optional(),
        status: Joi.string().optional(),
        keyword: Joi.string().optional(),
        fromDate: Joi.string().optional(),
        toDate: Joi.string().optional(),
        pageSize: Joi.number().default(20),
        pageIndex: Joi.number().default(1),
        sort: Joi.number().valid("desc", "asc"),
      }),
    },
  },
  post: {
    tags: ['api', 'Group'],
    description: 'Create group',
    handler: (req, res) => {
        return Response(req, res, 'post');
    },
    auth: {
        strategy: 'jwt',
    },
    validate: {
        payload: Joi.object({
            marathonId: Joi.string().required(),
            groupName: Joi.string().required(),
            password: Joi.string().required(),
            fullName: Joi.string().required(),
            email: Joi.string().required(),
            phone: Joi.string().required(),
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).options({allowUnknown: true}),
    }
  },
  deleteById: {
    tags: ["api", "Group"],
    description: "Delete group by id",
    handler: (req, res) => {
      return Response(req, res, "deleteById");
    },
    validate: {
      params: Joi.object({
        id: Joi.string().required(),
      }),
    },
  },
  // loginGroup: {
  //   tags: ['api', 'Group'],
  //   description: 'Authenticate',
  //   pre: [
  //       { method: verifyCredentials, assign: 'group' }
  //   ],
  //   handler: (req, res) => {
  //       if(req.pre.group.statusCode) return res.response(req.pre.group).code(req.pre.group.statusCode)
  //       Reflect.deleteProperty(req.pre.group, 'password');
  //       return res.response({ token: createToken(req.pre.group) }).code(200);
  //   },
  //   validate: {
  //       payload: Joi.object({
  //           username: Joi.string().required(),
  //           password: Joi.string().required()
  //       })
  //   }
  // },
};
