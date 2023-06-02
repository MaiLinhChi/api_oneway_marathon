const sendEmailRemoveMember = require('./remove-member')
const sendEmailDeleteGroup = require('./delete-group')
const sendEmailUpdateMember = require('./update-member')
module.exports = {
    sendEmailRemoveMember,
    sendEmailDeleteGroup,
    sendEmailUpdateMember
}