/**
 * Created by   on 3/19/2017.
 */
(function () {
    angular
        .module("app")
        .controller("eventController", eventController);

    eventController.$inject = ['$rootScope', '$scope', '$interval', 'eventDetails', 'providers', 'eventMarketService', 'eventStatus'];

    function eventController($rootScope, $scope, $interval, eventDetails, providers, eventMarketService, eventStatus) {
        $scope.providers = providers.data;
        $scope.eventDetails = eventDetails.data;
        $scope.eventStatus = eventStatus;
        $scope.loading = true;
        $scope.providerOdds = {};

        var getProvidersOdds = function () {
            eventMarketService.getEventProviderOdds($scope.eventDetails.id).then(function (odds) {
                if (!odds.data) return;
                $scope.providers.forEach(function (provider) {
                    var data = odds.data.find(p => p.provider_id == provider.id);
                    if (data) {
                        $scope.providerOdds[provider.id] = data.selections;
                    }
                })
            });
        };

        eventMarketService.getEventMarkets($scope.eventDetails.id, $rootScope.langId).then(function (markets) {
            $scope.eventMarkets = markets.data;
            $scope.loading = false;
        });

        $scope.getOdd = function (providerId, selectionId) {
            if (!$scope.providerOdds[providerId] || !$scope.providerOdds[providerId][selectionId]) return 0;
            var odd = $scope.providerOdds[providerId][selectionId].odd;
            return odd || 0;
        };

        $scope.stopOddsRefresh = function () {
            if (angular.isDefined(stop)) {
                $interval.cancel(stop);
                stop = undefined;
            }
        };

        getProvidersOdds();

        var stop = $interval(getProvidersOdds, 10000);
        $scope.$on('$destroy', function () {
            // Make sure that the interval is destroyed too
            $scope.stopOddsRefresh();
        });
    }
})();