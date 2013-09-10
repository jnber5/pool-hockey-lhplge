var Contract =      require('../models/Contract.js');

module.exports = {
    find: function(req, res) {
        Contract.find(req,res);
    },
    add: function(req, res, next) {
        Contract.add(req, res, next);
    },
    playersUnderContract: function(req, res){
        Contract.playersUnderContract(req, res);
    },
    findAll: function(req, res){
        Contract.findAll(req, res);
    }
};