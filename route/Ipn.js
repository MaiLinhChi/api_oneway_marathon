
const Joi                       = require('joi');
const Manager                   = require('../manager/Bib');
const Response                  = require('./response').setup(Manager);

module.exports = {
    getIpn: {
        tags: ['api', 'Ipn'],
        description: 'get ipn',
        handler: (req, res) => {
            return Response(req, res, 'get Ipn')
        },
    },
}