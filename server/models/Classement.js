var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var classementSchema = Schema({
    franchise      : { type: Schema.Types.ObjectId, ref: 'Franchise', required: true },
    pointsPeriode1 : { type: Number },
    pointsPeriode2 : { type: Number },
    pointsPeriode3 : { type: Number },
    pointsPeriode4 : { type: Number },
    pointsPeriode5 : { type: Number },
    dateMiseAJour  : {type: Date},
    userModif      : {type: String},
    note           : {type: String }
});

var Classement = mongoose.model('Classement', classementSchema);

module.exports = {
    
    
    Classement: Classement,
    
    findAll: function(res) {
        
        var jsonObj = []; 

        Classement.find({}).populate('franchise').exec(function (err, classement) {
            classement.forEach(function (item) {
                jsonObj.push({ id: item._id, franchise: item.franchise, pointsPeriode1: item.pointsPeriode1, pointsPeriode2: item.pointsPeriode2, pointsPeriode3: item.pointsPeriode3 , pointsPeriode4: item.pointsPeriode4 , pointsPeriode5: item.pointsPeriode5, pointsTotal : item.pointsPeriode1 + item.pointsPeriode2 + item.pointsPeriode3 + item.pointsPeriode4 + item.pointsPeriode5, dateMiseAJour: item.dateMiseAJour, userModif: item.userModif  });
            });
                res.json(jsonObj);
        });
    },
    save : function(req, res, next){
        
        Classement.findByIdAndUpdate(req.body.id, { pointsPeriode1: req.body.pointsPeriode1,
                                                    pointsPeriode2: req.body.pointsPeriode2,
                                                    pointsPeriode3: req.body.pointsPeriode3,
                                                    pointsPeriode4: req.body.pointsPeriode4,
                                                    pointsPeriode5: req.body.pointsPeriode5,
                                                    dateMiseAJour: req.body.dateMiseAJour,
                                                    userModif : req.body.userModif
                                                  }, function (err, classement) {
            if (err) {
                console.log(err);
                next(err);
            } else {
                res.json({ id: classement._id, franchise: classement.franchise, pointsPeriode1: classement.pointsPeriode1, pointsPeriode2: classement.pointsPeriode2, pointsPeriode3: classement.pointsPeriode3 , pointsPeriode4: classement.pointsPeriode4 , pointsPeriode5: classement.pointsPeriode5, pointsTotal : classement.pointsPeriode1 + classement.pointsPeriode2 + classement.pointsPeriode3 + classement.pointsPeriode4 + classement.pointsPeriode5, dateMiseAJour: classement.dateMiseAJour, userModif: classement.userModif });
            }
        });
    }
};