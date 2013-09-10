var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Player = require('./Player').Player,
    Team = require('./Team').Team;

var playerHistorySchema = Schema({
    _creator: { type: String, ref: 'Player' },
    position: { type: String, required: true },
    number: { type: Number, required: false },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true }
});

var PlayerHistory = mongoose.model('PlayerHistory', playerHistorySchema);

module.exports = {
    PlayerHistory: PlayerHistory,
    
    findAll: function(res) {
        PlayerHistory.find({}, function (err, playerHistories) {
            res.json(playerHistories);
        });
    },
    add: function(req,res,next){
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
    end : function(req, res, next){
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
    }
};