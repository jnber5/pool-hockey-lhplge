'use strict';

angular.module('lhplge')
.controller('NavCtrl', 
['$rootScope','$scope', '$location','Franchises', 'Auth', function($rootScope, $scope, $location, Franchises, Auth) {
    
    $scope.loading = true;
    $scope.user = Auth.user;
    $scope.userRoles = Auth.userRoles;
    $scope.accessLevels = Auth.accessLevels;
    
    Franchises.getAll(function(res) {
        $scope.franchises = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });
    
    $scope.logout = function() {
        Auth.logout(function() {
            $location.path('/login');
        }, function() {
            $rootScope.error = "Failed to logout";
        });
    };
}]);