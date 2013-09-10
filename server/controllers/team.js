var Team =      require('../models/Team.js');

module.exports = {
    findAll: function(req, res) {
        Team.findAll(res);
    }
};