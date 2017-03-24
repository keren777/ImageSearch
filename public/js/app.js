/**
 * Created by keren.kochanovitch on 24/03/2017.
 */
(function (angular) {
    'use strict';
    angular.module('imgSearch', [])
        .controller('imgSearchController', function ($scope, $http, $window) {

            $scope.master = {};
            $scope.histories = $window.localStorage.length > 0 ? getAllStorage($window.localStorage) : null;

            $scope.search = function (searchTerm, history = false) {
                if (searchTerm.tags == undefined || searchTerm.tags.trim() == "") {
                    searchTerm.tags = null;
                    $scope.master = angular.copy(searchTerm);
                    $scope.form.$submitted = true;
                    return false;
                }
                $scope.form.tags.$setUntouched();
                $scope.form.tags.$setValidity();

                const pixabayApi = `https://pixabay.com/api/?key=1631539-db8210cabd2636c6df59812df&&image_type=photo&q=${encodeURIComponent(searchTerm.tags)}`;
                const flickrApi = `https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=JSON_CALLBACK&tags=${encodeURIComponent(searchTerm.tags)}&format=json`;
                let flickrRes;

                $http.jsonp(flickrApi)
                    .then(res => {
                        flickrRes = res;
                        return $http.get(pixabayApi);
                    })
                    .then(pixabayRes => {
                        $scope.imagesPixabay = pixabayRes.data.hits;
                        $scope.imagesFlickr = flickrRes.data.items;

                        addToLocalStorage(searchTerm, history, pixabayRes, 'pixabay');
                        addToLocalStorage(searchTerm, history, flickrRes, 'flickr');

                        $scope.histories = $window.localStorage.length > 0 ? getAllStorage($window.localStorage) : null;
                    })
                    .catch(err => {
                      console.log(err);
                    });

                // reset form validation
                $scope.form.tags.$setValidity();
            };

            // reset form to initial state
            $scope.resetForm = function () {
                $scope.form.tags.$setValidity();
                $scope.imagesPixabay = {};
                $scope.imagesFlickr = {};
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