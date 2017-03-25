angular.module('imgSearch')
    .directive('imagesGrid', function () {

        return {
            restrict: 'E',
            templateUrl: 'imgGridTemplate.html',
        };
    });