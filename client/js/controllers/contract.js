'use strict';

angular.module('lhplge')
.controller('ContractAddCtrl',
['$rootScope', '$scope', '$filter', 'Players', 'Domains', 'Franchises', 'Contracts', function($rootScope, $scope, $filter, Players, Domains, Franchises, Contracts) {
    $scope.loading = true;
    $scope.dateAcquisition = '2013-07-01';
    $scope.joueursSousContrat = [];
    $scope.selectedPlayerIndex = 0;
    
    Players.getAll(function(res) {
        $scope.players = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });
    
    Domains.get({name: 'Raison_Fin_Contrat'}, function(res){
        $scope.fins = res;
        $scope.fin = res[0];
    }, function(err){
        $rootScope.error = "Failed to fetch Domains.";
    });
    
    Domains.get({name: 'Type_Acquisition'}, function(res){
        $scope.acquisitions = res;
        $scope.acquisition = res[0];
    }, function(err){
        $rootScope.error = "Failed to fetch Domains.";
    });
    
    Franchises.getAll(function(res) {
        $scope.franchises = res;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
    });
    
    $scope.addContract = function() {
        Contracts.add({
            franchise: $scope.franchise._id,
            player: $scope.player.id,
            acquisition: $scope.acquisition.value,
            fin: $scope.fin.value,
            startDate: $scope.dateAcquisition,
            endDate: $scope.player.dateFin
        },
            function (res) {
                $scope.joueursSousContrat.push($filter('getById')($scope.players, $scope.player.id));
                var ind = $scope.players.indexOf( $scope.player );
                $scope.players.splice( ind, 1 );
            },
            function (err) {
                $rootScope.error = "Une erreur est survenue lors de l'ajout. Le détail de l'erreur a été journalisé.";
            });
    };
    
    $scope.updateListeJoueursSousContrat = function() {
      Contracts.getPlayersUnderContract({
          franchise: $scope.franchise._id,
          dateConsultation: Date.now()
      },function(res){
          $scope.joueursSousContrat = res;
      },function(err){
          
      });
    };

}]);