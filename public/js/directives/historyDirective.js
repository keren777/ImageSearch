/**
 * Created by keren.kochanovitch on 24/03/2017.
 */


angular.module('imgSearch')
    .directive('history', function () {

        return {
            restrict: 'E',
            templateUrl: 'historyTemplate.html',
        };
    });