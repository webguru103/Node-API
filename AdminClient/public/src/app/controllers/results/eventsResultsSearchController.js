/**
 * Created by   on 3/19/2017.
 */
(function () {
    angular
        .module("app")
        .controller("eventsResultsSearchController", eventsResultsSearchController);

    eventsResultsSearchController.$inject = ['$rootScope', '$scope', '$modal', '$translate', '$q', '$timeout', 'sports', 'providers',
        'eventService', 'categoryService', 'toastr', 'eventStatus'];

    function eventsResultsSearchController($rootScope, $scope, $modal, $translate, $q, $timeout, sports, providers,
        eventService, categoryService, toastr, eventStatus) {
        sports.data.unshift({ name: "all" });
        $scope.sports = sports.data;
        $scope.providers = providers.data;

        $scope.filter = eventService.filter[eventStatus.CLOSED];
        $scope.events = eventService.events[eventStatus.CLOSED];

        $scope.filter.maxPages = 10000;
        $scope.filter.perPage = 150;
        if (!$scope.filter.currentPage) $scope.filter.currentPage = 1;

        $scope.searchEvents = function () {
            $scope.filter.currentPage = 1;
            $scope.onPageChange();
        };

        $scope.datePicker = {};
        $scope.datePicker.date = { startDate: moment().subtract(1, 'month'), endDate: moment() };

        $scope.onPageChange = function () {
            $scope.loading = true;
            $scope.events.length = 0;
            eventService.list($scope.filter.sport.id, $scope.filter.country.id, $scope.filter.league.id,
                moment($scope.datePicker.date.startDate.startOf('day')).format("YYYY-MM-DD HH:mm:ss"),
                moment($scope.datePicker.date.endDate.endOf('day')).format("YYYY-MM-DD HH:mm:ss"),
                $scope.filter.eventName,
                $rootScope.langId,
                eventStatus.CLOSED,
                $scope.filter.currentPage,
                $scope.filter.perPage)
                .then(function (data) {
                    $scope.events.push.apply($scope.events, data.data);
                    if ($scope.events[0]) $scope.filter.totalItems = $scope.events[0].full_count;
                    $scope.loading = false;
                }, function (error) {
                    $scope.loading = false;
                    toastr.error(error.data, $translate.instant('toast.error'))
                });
        };

        function loadCategories(id) {
            var defer = $q.defer();

            categoryService.getCategories({ parent_id: id, lang_id: $rootScope.langId }).then(function (data) {
                data.data.unshift({ name: "all" });
                defer.resolve(data.data);
            });

            return defer.promise;
        }

        $scope.onSportChange = function (sport) {
            loadCategories(sport.id, $rootScope.langId).then(function (data) {
                $scope.countries = data;

                //reset filters
                $scope.filter.country = $scope.countries[0];
                $scope.leagues = [].concat({ name: "all" });
                $scope.filter.league = { name: "all" };
            });
        };

        $scope.onCountryChange = function (country) {
            loadCategories(country.id, $rootScope.langId).then(function (data) {
                $scope.leagues = data;

                //reset filters
                $scope.filter.league = $scope.leagues[0];
            });
        };

        $scope.selectEvent = function (event) {
            if ($scope.selectedEvent) $scope.selectedEvent.selected = false;
            $scope.selectedEvent = event;
            event.selected = true;
        };

        if ($scope.filter.sport.id) {
            loadCategories($scope.filter.sport.id, $rootScope.langId).then(function (data) {
                $scope.countries = data;
            });
        }

        if ($scope.filter.country.id) {
            loadCategories($scope.filter.country.id, $rootScope.langId).then(function (data) {
                $scope.leagues = data;
            });
        }

        if ($scope.events.length == 0) {
            $scope.loading = true;
            $timeout($scope.searchEvents, 400);
        }
    }
})();