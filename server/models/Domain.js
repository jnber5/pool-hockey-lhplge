var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var domainSchema = Schema({
    name: { type: String, required: true },
    code: { type: String, required: true },
    value: { type: String, required: true }
});

var Domain = mongoose.model('Domain', domainSchema);

module.exports = {
    
    Domain: Domain,
    
    findAll: function(res) {
        Domain.find({}, function (err, domains) {
            res.json(domains);
        });
    },
    
    find: function(req, res) {
        Domain.find({name: req.params.name}, function (err, domain) {
            res.json(domain);
        });
    }
};