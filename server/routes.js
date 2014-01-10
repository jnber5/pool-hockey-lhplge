var _ =           require('underscore')
    , path =      require('path')
    , AuthCtrl =  require('./controllers/auth')
    , UserCtrl =  require('./controllers/user')
    , FranchiseCtrl =  require('./controllers/franchise')
    , PlayerCtrl =  require('./controllers/player')
    , TeamCtrl =    require('./controllers/team')
    , DomainCtrl = require('./controllers/domain')
    , ContractCtrl = require('./controllers/contract')
    , ClassementCtrl = require('./controllers/classement')
    , userRoles = require('../client/js/routingConfig').userRoles
    , accessLevels = require('../client/js/routingConfig').accessLevels;

var routes = [

    // Views
    {
        path: '/partials/*',
        httpMethod: 'GET',
        middleware: [function (req, res) {
            var requestedView = path.join('./', req.url);
            res.render(requestedView);
        }]
    },

    // Local Auth
    {
        path: '/register',
        httpMethod: 'POST',
        middleware: [AuthCtrl.register]
    },
    {
        path: '/login',
        httpMethod: 'POST',
        middleware: [AuthCtrl.login]
    },
    {
        path: '/logout',
        httpMethod: 'POST',
        middleware: [AuthCtrl.logout]
    },

    {
        path: '/api/users',
        httpMethod: 'GET',
        middleware: [UserCtrl.findAll],
        accessLevel: accessLevels.user
    },
    
    {
        path: '/api/franchises',
        httpMethod: 'GET',
        middleware: [FranchiseCtrl.findAll],
    },
    
    {
        path: '/api/franchise/:id',
        httpMethod: 'GET',
        middleware: [FranchiseCtrl.find],
        accessLevel: accessLevels.user
    },
    
    {
        path: '/api/players',
        httpMethod: 'GET',
        middleware: [PlayerCtrl.findAll],
        accessLevel: accessLevels.user
    },
    
    {
        path: '/api/player/:id',
        httpMethod: 'GET',
        middleware: [PlayerCtrl.find],
        accessLevel: accessLevels.user
    },
    
    {
        path: '/api/player',
        httpMethod: 'POST',
        middleware: [PlayerCtrl.add],
        accessLevel: accessLevels.admin
    },
    
    {
        path: '/api/playerHistory',
        httpMethod: 'POST',
        middleware: [PlayerCtrl.addHistory],
        accessLevel: accessLevels.admin
    },
    
    {
        path: '/api/playerHistory',
        httpMethod: 'PUT',
        middleware: [PlayerCtrl.endHistory],
        accessLevel: accessLevels.admin
    },
    
    {
        path: '/api/playerSalary',
        httpMethod: 'POST',
        middleware: [PlayerCtrl.addSalary],
        accessLevel: accessLevels.admin
    },
    
    {
        path: '/api/teams',
        httpMethod: 'GET',
        middleware: [TeamCtrl.findAll],
        accessLevel: accessLevels.user
    },
    
    {
        path: '/api/domain/:name',
        httpMethod: 'GET',
        middleware: [DomainCtrl.find],
        accessLevel: accessLevels.user
    },
    
    {
        path: '/api/contract/playersUnderContract/:franchise/:dateConsultation',
        httpMethod: 'GET',
        middleware: [ContractCtrl.playersUnderContract],
        accessLevel: accessLevels.user
    },
    
     {
        path: '/api/contracts/:dateConsultation',
        httpMethod: 'GET',
        middleware: [ContractCtrl.findAll],
        accessLevel: accessLevels.user
    },
    
    {
        path: '/api/contract',
        httpMethod: 'POST',
        middleware: [ContractCtrl.add],
        accessLevel: accessLevels.admin
    },
    
    {
        path: '/api/classement',
        httpMethod: 'GET',
        middleware: [ClassementCtrl.findAll],
        accessLevel: accessLevels.user
    },
    
    {
        path: '/api/classement',
        httpMethod: 'POST',
        middleware: [ClassementCtrl.save],
        accessLevel: accessLevels.user
    },

    // All other get requests should be handled by AngularJS's client-side routing system
    {
        path: '/*',
        httpMethod: 'GET',
        middleware: [function(req, res) {
            
            var role = userRoles.public, username = '', id = '', franchise = '', email = '', nickname = '';
            if(req.user) {
                role = req.user.role;
                username = req.user.username;
                id = req.user.id;
                franchise = req.user.franchise;
                email = req.user.email;
                nickname = req.user.nickname;
            }

            res.cookie('user', JSON.stringify({
                'username': username,
                'role': role,
                'franchise': franchise,
                'nickname': nickname
            }));
            res.render('index');
        }]
    }
];

module.exports = function(app) {

    _.each(routes, function(route) {
        route.middleware.unshift(ensureAuthorized);
        var args = _.flatten([route.path, route.middleware]);

        switch(route.httpMethod.toUpperCase()) {
            case 'GET':
                app.get.apply(app, args);
                break;
            case 'POST':
                app.post.apply(app, args);
                break;
            case 'PUT':
                app.put.apply(app, args);
                break;
            case 'DELETE':
                app.delete.apply(app, args);
                break;
            default:
                throw new Error('Invalid HTTP method specified for route ' + route.path);
                break;
        }
    });
};

function ensureAuthorized(req, res, next) {
    var role;
    if(!req.user) role = userRoles.public;
    else          role = req.user.role;

    var accessLevel = _.findWhere(routes, { path: req.route.path }).accessLevel || accessLevels.public;

    if(!(accessLevel.bitMask & role.bitMask)) return res.send(403);
    return next();
}