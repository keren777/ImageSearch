/**
 * Created by keren.kochanovitch on 24/03/2017.
 */
(function (angular) {
    'use strict';
    angular.module('imgSearch', [])
        .controller('imgSearchController', function ($scope, $http, $window) {

            $scope.histories = $window.localStorage.length > 0 ? getAllStorage($window.localStorage) : null;

            $scope.searchFlickr = function (searchTerm, page = 1, history = false) {
                if (searchTerm.tags == undefined || searchTerm.tags.trim() == "") {
                    searchTerm.tags = null;
                    return false;
                }
                $scope.service = 'Flicker';
                $scope.searchTerm = searchTerm;

                const flickrApi = `https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tags=${encodeURIComponent(searchTerm.tags)}&format=json`;

                $http.jsonp(flickrApi)
                    .then(res => {
                        $scope.images = res.data.items;
                        $scope.pages = null;
                        addToLocalStorage(searchTerm, history, res, 'flickr');
                        $scope.histories = $window.localStorage.length > 0 ? getAllStorage($window.localStorage) : null;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            };


            $scope.searchPixabay = function (searchTerm, page = 1, history = false) {
                if (searchTerm.tags == undefined || searchTerm.tags.trim() == "") {
                    searchTerm.tags = null;
                    return false;
                }
                $scope.service = 'Pixabay';
                $scope.searchTerm = searchTerm;

                const pixabayApi = `https://pixabay.com/api/?key=1631539-db8210cabd2636c6df59812df&&image_type=photo&q=${encodeURIComponent(searchTerm.tags)}&page=${page}`;

                $http.get(pixabayApi)
                    .then(res => {
                        $scope.images = res.data.hits;
                        $scope.pages = new Array(res.data.totalHits / 20);

                        addToLocalStorage(searchTerm, history, res, 'pixabay');

                        $scope.histories = $window.localStorage.length > 0 ? getAllStorage($window.localStorage) : null;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            };

            $scope.resetForm = function () {
                $scope.form.tags.$setValidity();
                $scope.images = {};
                $scope.searchTerm = {};
            };

            function getAllStorage(localStorage) {
                const archive = [],
                    keys = Object.keys(localStorage);

                let i = 0, key;
                for (; key = keys[i]; i++) {
                    archive.push( JSON.parse(localStorage.getItem(key)));
                }
                return archive;
            }

            function addToLocalStorage(searchTerm, history, service, serviceName) {
                const ts = Date.now();
                const date = new Date();

                const hours = date.getHours();
                let minutes = date.getMinutes();

                if (minutes < 10) {
                    minutes = "0" + minutes;
                }

                if (!history) {
                    $window.localStorage.setItem(`${serviceName}_${ts}`, JSON.stringify({
                        term: searchTerm.tags,
                        service: serviceName,
                        time: {
                            day: date.toLocaleDateString('en-US'),
                            time: `${hours}:${minutes}`
                        },
                        resNum: service.data.total || 20,
                        tagsObj: searchTerm
                    }));
                }
            }

        });
})(window.angular);