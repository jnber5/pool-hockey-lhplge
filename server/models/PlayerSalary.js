var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Player = require('./Player').Player,
    PlayerHistory = require('./PlayerHistory').PlayerHistory,
    Team = require('./Team').Team;

var playerSalarySchema = Schema({
    _creator: { type: String, ref: 'Player' },
    caphit: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

var PlayerSalary = mongoose.model('PlayerSalary', playerSalarySchema);

module.exports = {
    PlayerSalary: PlayerSalary, 
    
    add : function(req, res, next){
            var playerSalary = new PlayerSalary({
            _creator: req.body.playerId,
            caphit: req.body.caphit,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        });
    
        playerSalary.save(function (err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                Player.findById(req.body.playerId, function (err, player) {
                    player.salaries.push(playerSalary);
                    player.save(function (err) {
                        if (err) {
                            console.log(err);
                            next(err);
                        } else {
                            Player.findById(req.body.playerId).lean().populate('histories').populate('salaries').exec(function (err, player) {
                                PlayerHistory.populate(player, {
                                    path: 'histories.team',
                                    model: Team
                                }, function (err, player) {
                                    res.json(player);
                                });
                            });
                        }
                    });
                });
            }
        });
    }
};