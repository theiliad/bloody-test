angular.module('dangerZone')
        .config(function($mdThemingProvider) {
          $mdThemingProvider.theme('default')
            .primaryPalette('deep-orange')
            .accentPalette('indigo');
        })

        .controller("dangerZoneCtrl", function($rootScope, $scope, $mdSidenav, $mdToast, $state) {
            $scope.analyze = function(url) {
                alert(url);
            }
        });