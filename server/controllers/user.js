var User =      require('../models/User.js');

module.exports = {
    findAll: function(req, res) {
        User.findAll(res);
    }
};