'use strict';

angular.module('lhplge', ['ngCookies'])

    .config(['$routeProvider', '$locationProvider', '$httpProvider', function ($routeProvider, $locationProvider, $httpProvider) {

    var access = routingConfig.accessLevels;

    $routeProvider.when('/',
        {
            templateUrl:    '/partials/home',
            controller:     'HomeCtrl',
            access:         access.user
        });
    $routeProvider.when('/login',
        {
            templateUrl:    '/partials/login',
            controller:     'LoginCtrl',
            access:         access.anon
        });
    $routeProvider.when('/players',
        {
            templateUrl:    '/partials/player/players',
            controller:     'PlayersCtrl',
            access:         access.user
        });
     $routeProvider.when('/agentsLibres',
        {
            templateUrl:    '/partials/player/agentsLibres',
            controller:     'AgentsLibresCtrl',
            access:         access.user
        });
    $routeProvider.when('/classement',
        {
            templateUrl:    '/partials/classement/classement',
            controller:     'ClassementCtrl',
            access:         access.user
        });
    $routeProvider.when('/draft',
        {
            templateUrl:    '/partials/repechage/ordre',
            access:         access.user
        });
    $routeProvider.when('/player/add',
        {
            templateUrl: '/partials/player/player_add',
            controller: 'PlayerAddCtrl',
            access: access.admin
        });
    $routeProvider.when('/player/edit/:id',
        {
            templateUrl:    '/partials/player/player_edit',
            controller:     'PlayerEditCtrl',
            access:         access.admin
        });
    $routeProvider.when('/contract/add',
        {
            templateUrl: '/partials/contract/contract_add',
            controller: 'ContractAddCtrl',
            access: access.admin
        });
    $routeProvider.when('/franchise/:id',
        {
            templateUrl:    '/partials/franchise/franchise',
            controller:     'FranchiseCtrl',
            access:         access.user
        });
    $routeProvider.when('/users',
        {
            templateUrl:    '/partials/user/users',
            controller:     'UsersCtrl',
            access:         access.admin
        });
    $routeProvider.when('/register',
        {
            templateUrl:    '/partials/register',
            controller:     'RegisterCtrl',
            access:         access.anon
        });
    $routeProvider.when('/private',
        {
            templateUrl:    '/partials/private',
            controller:     'PrivateCtrl',
            access:         access.user
        });
    $routeProvider.when('/404',
        {
            templateUrl:    '/partials/404',
            access:         access.public
        });
    $routeProvider.otherwise({redirectTo:'/404'});

    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q', function($location, $q) {
        function success(response) {
            return response;
        }

        function error(response) {

            if(response.status === 401) {
                $location.path('/login');
                return $q.reject(response);
            }
            else {
                return $q.reject(response);
            }
        }

        return function(promise) {
            return promise.then(success, error);
        }
    }];

    $httpProvider.responseInterceptors.push(interceptor);

}])

    .run(['$rootScope', '$location', 'Auth', function ($rootScope, $location, Auth) {

        $rootScope.$on("$routeChangeStart", function (event, next, current) {
            $rootScope.error = null;
            if (!Auth.authorize(next.access)) {
                if(Auth.isLoggedIn()) $location.path('/');
                else                  $location.path('/login');
            }
        });

    }]);