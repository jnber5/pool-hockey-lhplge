'use strict';

angular.module('lhplge')
.factory('Auth', function($http, $cookieStore){

    var accessLevels = routingConfig.accessLevels
        , userRoles = routingConfig.userRoles
        , currentUser = $cookieStore.get('user') || { username: '', role: userRoles.public };

    $cookieStore.remove('user');
    
    function changeUser(user) {
        _.extend(currentUser, user);
    }

    return {
        authorize: function(accessLevel, role) {
            if(role === undefined)
                role = currentUser.role;

            return accessLevel.bitMask & role.bitMask;
        },
        isLoggedIn: function(user) {
            if(user === undefined)
                user = currentUser;
            return user.role.title == userRoles.user.title || user.role.title == userRoles.admin.title;
        },
        register: function(user, success, error) {
            $http.post('/register', user).success(function(res) {
                changeUser(res);
                success();
            }).error(error);
        },
        login: function(user, success, error) {
            $http.post('/login', user).success(function(user){
                changeUser(user);
                success(user);
            }).error(error);
        },
        logout: function(success, error) {
            $http.post('/logout').success(function(){
                changeUser({
                    username: '',
                    role: userRoles.public
                });
                success();
            }).error(error);
        },
        accessLevels: accessLevels,
        userRoles: userRoles,
        user: currentUser
    };
});

angular.module('lhplge')
.factory('Users', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/api/users').success(success).error(error);
        }
    };
});

angular.module('lhplge')
.factory('Franchises', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/api/franchises').success(success).error(error);
        },
        get: function(data, success, error) {
            $http.get('/api/franchise/' + data.id).success(success).error(error);
        }
    };
});

angular.module('lhplge')
.factory('Players', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/api/players').success(success).error(error);
        },
        add: function(player, success, error) {
            $http.post('/api/player', player).success(success).error(error);
        },
        get: function(data, success, error) {
            $http.get('/api/player/' + data.id).success(success).error(error);
        },
        addHistory: function(playerHistory, success, error) {
            $http.post('/api/playerHistory', playerHistory).success(success).error(error);
        },
        endHistory: function(data, success, error){
            $http.put('/api/playerHistory', data).success(success).error(error);
        },
        addSalary: function(playerSalary, success, error) {
            $http.post('/api/playerSalary', playerSalary).success(success).error(error);
        },
    };
});

angular.module('lhplge')
.factory('Teams', function($http) {
    return {
        getAll: function(success, error) {
            $http.get('/api/teams').success(success).error(error);
        }
    };
});

angular.module('lhplge')
.factory('Domains', function($http) {
    return {
        get: function(data, success, error) {
            $http.get('/api/domain/'+ data.name).success(success).error(error);
        }
    };
});

angular.module('lhplge')
.factory('Contracts', function($http) {
    return{
        getPlayersUnderContract: function(data, success, error) {
            $http.get('/api/contract/playersUnderContract/' + data.franchise + '/' + data.dateConsultation).success(success).error(error);
        },
        getAll: function(data, success, error) {
            $http.get('/api/contracts/' + data.dateConsultation).success(success).error(error);
        },
        add: function(data, success, error) {
            $http.post('/api/contract', data).success(success).error(error);
        }
    };
});
