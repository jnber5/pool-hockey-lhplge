var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Player = require('./Player').Player,
    PlayerHistory = require('./Player').PlayerHistory,
    PlayerSalary = require('./Player').PlayerSalary,
    Team = require('./Team').Team;

var contractSchema = Schema({
    franchise: { type: Schema.Types.ObjectId, ref: 'Franchise', required: true },
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true },
    acquisition: { type: String, required: true },
    fin: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true }
});
var Contract = mongoose.model('Contract', contractSchema);

module.exports = {
    
    Contract: Contract,

    add: function(req, res, next) {
        console.log(req.body);
        var contract = new Contract({
            franchise: req.body.franchise,
            player: req.body.player,
            acquisition: req.body.acquisition,
            fin: req.body.fin,
            startDate: req.body.startDate,
            endDate: req.body.endDate
        });

        contract.save(function (err) {
            if (err) {
                next(err);
            } else {
                console.log('contract: saved.');
                res.json(contract);
            }
        });
    },
    playersUnderContract: function (req, res, next) {
        var jsonObj = []; 
        Contract.find({
            franchise: req.params.franchise,
            startDate: {
                "$lte": req.params.dateConsultation
            },
            endDate: {
                "$gte": req.params.dateConsultation
            }
        }).populate('player').exec(function (err, contracts) {
            Player
                .populate(contracts, {
                        path: 'player.histories',
                        model: PlayerHistory
                    },
                    function (err, contracts) {
                        Player.populate(contracts, {
                            path: 'player.salaries',
                            model: PlayerSalary
                        }, function (err, contracts) {
                            PlayerHistory.populate(contracts, {
                                path: 'player.histories.team',
                                model: Team
                            }, function (err, contracts) {
                                contracts.forEach(function (item) {
                                    jsonObj.push({ id: item.player._id, 
                                                   firstName: item.player.firstName, 
                                                   lastName: item.player.lastName, 
                                                   team: item.player.histories[item.player.histories.length - 1].team.city, 
                                                   position: item.player.histories[item.player.histories.length - 1].position, 
                                                   capHit: item.player.salaries[item.player.salaries.length - 1].caphit, 
                                                   duree: calculerDuree(item.player.salaries[item.player.salaries.length - 1].endDate), 
                                                   dateFin: item.player.salaries[item.player.salaries.length - 1].endDate });
                                });
                                res.json(jsonObj);
                            });
                        });
                    }
    
            );
    
        });
    },
    findAll: function (req, res, next) {
        Contract.find({
            startDate: {
                "$lte": req.params.dateConsultation
            },
            endDate: {
                "$gte": req.params.dateConsultation
            }
        }, function (err, contracts) {
            res.json(contracts);
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