'use strict';

angular.module('lhplge')
.controller('PrivateCtrl',
['$rootScope', '$scope', 'Auth', function($rootScope, $scope, Auth) {
    
    $scope.user = Auth.user;
    
}]);
