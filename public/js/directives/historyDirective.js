angular.module('imgSearch')
    .directive('history', function () {

        return {
            restrict: 'E',
            templateUrl: 'historyTemplate.html',
        };
    });