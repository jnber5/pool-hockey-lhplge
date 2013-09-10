'use strict';

angular.module('lhplge')
.controller('PlayersCtrl',
['$rootScope', '$scope', 'Players', function($rootScope, $scope, Players) {
    $scope.loading = true;
    
    Players.getAll(function(res) {
        $scope.players = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch users.";
        $scope.loading = false;
    });
    
}])
.controller('AgentsLibresCtrl',
['$rootScope', '$scope', 'Players', 'Contracts', 'Teams', 'Domains', function($rootScope, $scope, Players, Contracts, Teams, Domains) {
    $scope.loading = true;
    $scope.predicate = ['-capHit'];
    $scope.durees = ['1', '2', '3'];

    Players.getAll(function(res) {
        $scope.players = res;
        $scope.loading = false;
    }, function(err) {
        $rootScope.error = "Failed to fetch players.";
        $scope.loading = false;
    });
    
    Contracts.getAll({
        dateConsultation: Date.now()
        }, function(res) {
        $scope.contracts = res;
       
    }, function(err) {
        $rootScope.error = "Failed to fetch contracts.";
    });
    
    Teams.getAll(function(res){
       $scope.teams = res; 
    }, function(err){
        $rootScope.error = "Failed to fetch teams.";
    });
    
    Domains.get({name: 'Position'}, function(res){
        $scope.positions = res;
    }, function(err){
        $rootScope.error = "Failed to fetch Domains.";
    });
    
}])
.controller('PlayerAddCtrl',
['$rootScope', '$scope', '$location', 'Players', function($rootScope, $scope, $location, Players) {
   
    $scope.addPlayer = function () {
        Players.add({
            firstName: $scope.firstName,
            lastName: $scope.lastName
        },
            function (res) {
                $location.path('/player/edit/' + res._id);
            },
            function (err) {
                $rootScope.error = "Une erreur est survenue lors de l'ajout. Le détail de l'erreur a été journalisé.";
            });
    };

}])
.controller('PlayerEditCtrl',
['$routeParams', '$rootScope', '$scope', 'Players', 'Teams', 'Domains', function($routeParams, $rootScope, $scope, Players, Teams, Domains) {
    
    $scope.mode = 'edit';
    $scope.historyEndDate = '9999-12-31';
    $scope.historyStartDate = '2013-07-01';
    $scope.salaryStartDate = '2013-07-01';
    $scope.salaryEndDate = '2014-06-30';
    
    Players.get({id: $routeParams.id}, function(res){
        $scope.player = res;
        if (res.salaries){
            $scope.showSalary = false;
        }else{
            $scope.showSalary = true;
        }
    }, function(err){
        $rootScope.error = "Failed to fetch Player.";
    });
    
    Teams.getAll(function(res){
       $scope.teams = res; 
    }, function(err){
        $rootScope.error = "Failed to fetch teams.";
    });
    
    Domains.get({name: 'Position'}, function(res){
        $scope.positions = res;
    }, function(err){
        $rootScope.error = "Failed to fetch Domains.";
    });
    
    $scope.convertDate = function (dt) {
        if (dt) {
            var localDate = new Date(dt);
            var localTime = localDate.getTime();
            var localOffset = localDate.getTimezoneOffset() * 60000;
            return new Date(localTime + localOffset);
        }
    };
    
    $scope.addPlayerHistory = function () {
        Players.addHistory({
            playerId: $routeParams.id,
            team: $scope.team._id,
            position: $scope.position.code,
            number: $scope.number,
            startDate: $scope.historyStartDate,
            endDate: $scope.historyEndDate,
        },
            function (res) {
                $scope.player = res;
                $rootScope.error = '';
                $scope.team = '';
                $scope.position = '';
                $scope.number = '';
                $scope.historyStartDate = '';
            },
            function (err) {
                $rootScope.error = "Une erreur est survenue lors de l'ajout. Le détail de l'erreur a été journalisé.";
            });
    };

   $scope.endPlayerHistory = function (playerHistoryId, histEndDate) {
        
        Players.endHistory({
            playerHistoryId: playerHistoryId,
            historyEndDate: histEndDate
        },
            function (res) {
                $scope.player = res;
                $rootScope.error = '';
            },
            function (err) {
                $rootScope.error = "Une erreur est survenue lors de l'ajout. Le détail de l'erreur a été journalisé.";
            });
    };

    $scope.addPlayerSalary = function () {
        Players.addSalary({
            playerId: $routeParams.id,
            caphit: $scope.caphit,
            startDate: $scope.salaryStartDate,
            endDate: $scope.salaryEndDate,
        },
            function (res) {
                $scope.player = res;
                $rootScope.error = '';
                $scope.team = '';
                $scope.position = '';
                $scope.number = '';
                $scope.historyStartDate = '';
            },
            function (err) {
                $rootScope.error = "Une erreur est survenue lors de l'ajout. Le détail de l'erreur a été journalisé.";
            });
    };

}]);