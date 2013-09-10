var Franchise =      require('../models/Franchise.js');

module.exports = {
    findAll: function(req, res) {
        Franchise.findAll(res);
    },
    find: function(req, res) {
        console.log ('RERRDD');
        Franchise.find(req, res);
    }
};