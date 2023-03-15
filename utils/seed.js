const UserAdminModel      = require('../model/User');
const { hashPassword } = require('../utils/userFunctions');

UserAdminModel.findOne({username: process.env.ADMIN_USERNAME}).then(user => {
    if (!user) {
        hashPassword(process.env.ADMIN_PASS, (err, hash) => {
            if (err) throw err;
            const model = new UserAdminModel({
                username: process.env.ADMIN_USERNAME,
                password: hash,
                status: 'active',
                role: 'admin'
            });
            return model.save();
        });
    }
})