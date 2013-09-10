'use strict';

angular.module('lhplge')
.controller('FranchiseCtrl',
['$routeParams','$rootScope', '$scope', 'Contracts', 'Franchises', function($routeParams, $rootScope, $scope, Contracts, Franchises) {
    $scope.loading = true;
    $scope.predicate = ['position','-capHit'];
    
    Franchises.get({
      id : $routeParams.id  
    }, function(res){
        $scope.franchise = res;
    }, function(err){
        
    });
    
    Contracts.getPlayersUnderContract({
        franchise: $routeParams.id,
        dateConsultation: Date.now()
    },function(res){
        $scope.players = res;
        $scope.loading = false;
    },function(err){
        $scope.loading = false;
    });

}]);