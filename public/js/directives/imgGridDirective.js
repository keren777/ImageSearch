/**
 * Created by keren.kochanovitch on 24/03/2017.
 */


angular.module('imgSearch')
    .directive('imagesGrid', function () {

        return {
            restrict: 'E',
            templateUrl: 'imgGridTemplate.html',
        };
    });