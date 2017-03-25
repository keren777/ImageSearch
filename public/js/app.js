(function (angular) {
    'use strict';
    angular.module('imgSearch', [])
        .controller('imgSearchController', function ($scope, $http, $window) {

            $scope.histories = $window.localStorage.length > 0 ? getAllStorage() : null;

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
                        $scope.pages = (res.data.totalHits ? new Array( Math.ceil(res.data.totalHits / 20)) : null);

                        addToLocalStorage(searchTerm, history, res, 'pixabay');

                        $scope.histories = $window.localStorage.length > 0 ? getAllStorage() : null;
                    })
                    .catch(err => {
                        console.log(err);
                    });
            };

            $scope.clearHistory = function () {
                if (confirm("You are about to remove all history, Are you sure?")) {
                    const keys = Object.keys($window.localStorage);
                    let i = 0, key;
                    for (; key = keys[i]; i++) {
                        if (key.includes('flickr') || key.includes('pixabay')) {
                            $window.localStorage.removeItem(key);
                        }
                    }
                    $scope.histories = $window.localStorage.length > 0 ? getAllStorage() : null;
                    $scope.resetForm();
                }
            };


            $scope.resetForm = function () {
                $scope.images = {};
                $scope.pages = null;
                $scope.searchTerm = {};
            };

            function getAllStorage() {
                const archive = [],
                    keys = Object.keys($window.localStorage);

                let i = 0, key;
                for (; key = keys[i]; i++) {
                    archive.push( JSON.parse($window.localStorage.getItem(key)));
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