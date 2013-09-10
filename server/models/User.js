var User
    , _ =               require('underscore')
    , passport =        require('passport')
    , LocalStrategy =   require('passport-local').Strategy
    , check =           require('validator').check
    , userRoles =       require('../../client/js/routingConfig').userRoles
    , mongoose =        require('mongoose')
    , bcrypt  =         require('bcrypt')
    , SALT_WORK_FACTOR = 10
    , Schema = mongoose.Schema
  
//User Schema
var userSchema = mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    nickname: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phoneNumber: { type: String },
    cellPhoneNumber: { type: String },
    role: { bitMask: Number, title: String },
    franchise: { type: Schema.Types.ObjectId, ref: 'Franchise', required: false }
});

// Bcrypt middleware
userSchema.pre('save', function (next) {
    var user = this;

    if (!user.isModified('password')) return next();

    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);

        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });
});

// Password verification
userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

var User = mongoose.model('User', userSchema);

module.exports = {
    addUser: function(username, password, role, callback) {
        if(this.findByUsername(username) !== undefined)  return callback("UserAlreadyExists");

        var user = {
            id:         _.max(users, function(user) { return user.id; }).id + 1,
            username:   username,
            password:   password,
            role:       role
        };
        users.push(user);
        callback(null, user);
    },

    findAll: function(res) {
        User.find({}, '-password')
          .populate('franchise')
          .exec(function (err, users) {
            res.json(users);
        });
    },

    findById: function(id) {
        return _.clone(_.find(users, function(user) { return user.id === id }));
    },

    findByUsername: function(username) {
        return _.clone(_.find(users, function(user) { return user.username === username; }));
    },

    validate: function(user) {
        check(user.username, 'Username must be 1-20 characters long').len(1, 20);
        check(user.password, 'Password must be 5-60 characters long').len(5, 60);
        // check(user.username, 'Invalid username').not(/((([A-Za-z]{3,9}:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)/);

        // TODO: Seems node-validator's isIn function doesn't handle Number arrays very well...
        // Till this is rectified Number arrays must be converted to string arrays
        // https://github.com/chriso/node-validator/issues/185
        var stringArr = _.map(_.values(userRoles), function(val) { return val.toString() });
        check(user.role, 'Invalid user role given').isIn(stringArr);
    },

    localStrategy: new LocalStrategy(function (username, password, done) {
        User.findOne({ username: username })
            .populate('franchise')
            .exec( function (err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
            user.comparePassword(password, function (err, isMatch) {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }),

    serializeUser: function(user, done) {
        done(null, user.id);
    },

    deserializeUser: function(id, done) {
        User.findById(id, function (err, user) {
            done(err, user);
        });
    }
};