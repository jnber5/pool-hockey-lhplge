var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var teamSchema = Schema({
    teamName: { type: String, required: true },
    city: { type: String, required: true },
    abbreviation: { type: String, required: true }
});

var Team = mongoose.model('Team', teamSchema);

module.exports = {
    Team: Team,
    findAll: function(res) {
        Team.find({}, function (err, teams) {
            res.json(teams);
        });
    }
};