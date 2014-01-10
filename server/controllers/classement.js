var Classement = require('../models/Classement.js');

module.exports = {
    findAll: function(req, res) {
        Classement.findAll(res);
    },
    save: function(req, res){
        Classement.save(req,res);
    }
};