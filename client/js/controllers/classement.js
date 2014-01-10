'use strict';

angular.module('lhplge')
.controller('ClassementCtrl',
['$rootScope', '$scope', 'Classement', 'Auth', function($rootScope, $scope, Classement, Auth) {

    $scope.predicate = 'pointsTotal';
    $scope.reverse = true;
    console.log('AUTH : ' + Auth.user.nickname);

    Classement.getAll(function(res) {
        $scope.classement = res;
    }, function(err) {
        $rootScope.error = "Failed to fetch players.";
    });
    
    $scope.save = function(){
      $scope.classement.forEach(function(item){
         item.userModif =  Auth.user.nickname;
         item.dateMiseAJour = new Date();
         Classement.save(item, function(res) {
            
         });
      });
      
      Classement.getAll(function(res) {
        $scope.classement = res;
        }, function(err) {
            $rootScope.error = "Failed to fetch players.";
        });
      
    };
    
}]);