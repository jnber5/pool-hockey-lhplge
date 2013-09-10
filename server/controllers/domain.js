var Domain =      require('../models/Domain.js');

module.exports = {
    findAll: function(req, res) {
        Domain.findAll(res);
    }, 
    find: function(req, res) {
        Domain.find(req,res);
    }
};