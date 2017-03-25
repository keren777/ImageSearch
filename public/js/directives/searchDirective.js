angular.module('imgSearch')
    .directive('search', function () {

        return {
            restrict: 'E',
            templateUrl: 'searchTemplate.html',
        };
    });