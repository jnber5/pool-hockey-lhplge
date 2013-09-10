var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Team = require('./Team').Team;

var playerSchema = Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    histories: [{ type: Schema.Types.ObjectId, ref: 'PlayerHistory', required: false }],
    salaries: [{ type: Schema.Types.ObjectId, ref: 'PlayerSalary', required: false }]
});

var playerHistorySchema = Schema({
    _creator: { type: String, ref: 'Player' },
    position: { type: String, required: true },
    number: { type: Number, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true }
});

var playerSalarySchema = Schema({
    _creator: { type: String, ref: 'Player' },
    caphit: { type: Number, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});

var Player = mongoose.model('Player', playerSchema);
var PlayerHistory = mongoose.model('PlayerHistory', playerHistorySchema);
var PlayerSalary = mongoose.model('PlayerSalary', playerSalarySchema);

module.exports = {
    
    Player: Player,
    PlayerHistory: PlayerHistory,
    PlayerSalary: PlayerSalary,
    
    findAll: function(res) {
        var jsonObj = []; 

        Player.find({}).sort({ lastName: 1 }).lean().populate('histories').populate('salaries').exec(function (err, players) {
            PlayerHistory.populate(players, {
                path: 'histories.team',
                model: Team
            }, function (err, players) {
                players.forEach(function (item) {
                    jsonObj.push({ id: item._id, firstName: item.firstName, lastName: item.lastName, team: item.histories[item.histories.length - 1].team.city, position: item.histories[item.histories.length - 1].position, capHit: item.salaries[item.salaries.length - 1].caphit, duree: calculerDuree(item.salaries[item.salaries.length - 1].endDate), dateFin: item.salaries[item.salaries.length - 1].endDate });
                });
                res.json(jsonObj);
            });
        });
    },
    find: function(req, res, next){
        Player.findById(req.params.id).lean().populate('histories').populate('salaries').exec(function (err, player) {
            PlayerHistory.populate(player, {
                path: 'histories.team',
                model: Team
            }, function (err, player) {
                res.json(player);
            });
        });
    },
    add: function(req, res, next){
        
        var player = new Player({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            histories: [],
            salaries: []
        });

        player.save(function (err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                console.log('player: ' + player.lastName + " saved.");
                res.json(player);
            }
        });
    },
    findAllHistories: function(res) {
        PlayerHistory.find({}, function (err, playerHistories) {
            res.json(playerHistories);
        });
    },
    addHistory: function(req,res,next){
        var playerHistory = new PlayerHistory({
            _creator: req.body.playerId,
            position: req.body.position,
            number: req.body.number,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            team: req.body.team
        });
    
        playerHistory.save(function (err) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                Player.findById(req.body.playerId, function (err, player) {
                    player.histories.push(playerHistory);
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
    },
    endHistory : function(req, res, next){
        PlayerHistory.findByIdAndUpdate(req.body.playerHistoryId, { endDate: req.body.historyEndDate }, function (err, playerHistory) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                Player.findById(playerHistory._creator).lean().populate('histories').populate('salaries').exec(function (err, player) {
                    PlayerHistory.populate(player, {
                        path: 'histories.team',
                        model: Team
                    }, function (err, player) {
                        res.json(player);
                    });
                });
            }
        });
    },
    addSalary : function(req, res, next){
        
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

function calculerDuree(dateFin) {
    var oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    var today = new Date();
    var diffDays = Math.round(Math.abs((dateFin.getTime() - today.getTime()) / (oneDay)));

    if (diffDays < 365) {
        return 1;
    }
    else if (diffDays >= 365 && diffDays < 730) {
        return 2;
    }
    else {
        return 3;
    }
}
