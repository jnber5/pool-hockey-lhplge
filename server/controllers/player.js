var Player = require('../models/Player.js');

module.exports = {
    findAll: function(req, res) {
        Player.findAll(res);
    },
    find: function(req,res,next) {
        Player.find(req, res);
    },
    add: function(req, res, next) {
        Player.add(req,res,next);
    },
    addHistory: function(req,res,next) {
        Player.addHistory(req, res, next);
    },
    endHistory: function(req,res,next) {
        Player.endHistory(req, res, next);
    },
    addSalary: function(req,res,next) {
        Player.addSalary(req, res, next);
    }
};