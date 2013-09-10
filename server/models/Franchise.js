var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var franchiseSchema = Schema({
    nom: { type: String, required: true },
    users: [{ type: Schema.Types.ObjectId, ref: 'User', required: false }]
});

var Franchise = mongoose.model('Franchise', franchiseSchema);

module.exports = {
    findAll: function(res) {
        Franchise.find({}, function (err, franchises) {
            res.json(franchises);
        });
    },
    find: function(req, res){
         Franchise.findById(req.params.id, function (err, franchise) {
            res.json(franchise);
        });
    }
};
