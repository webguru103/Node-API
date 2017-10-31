/**
 * Created by   on 3/19/2017.
 */
(function () {
    angular
        .module("app")
        .controller("eventResultController", eventResultController);

    eventResultController.$inject = ['$rootScope', '$scope', '$interval', '$modal', '$translate', 'settingsService', 'resultService',
        'eventDetails', 'eventStatus', 'providers', 'eventMarketService', 'resultType'];

    function eventResultController($rootScope, $scope, $interval, $modal, $translate, settingsService, resultService,
        eventDetails, eventStatus, providers, eventMarketService, resultType, ) {
        $scope.providers = providers.data;
        $scope.eventDetails = eventDetails.data;
        $scope.loading = true;
        $scope.providerOdds = {};
        $scope.eventStatus = eventStatus;
        $scope.selectionsResults = [];
        var getProvidersOdds = function () {
            $scope.providers.forEach(function (provider) {
                eventMarketService.getProviderOdds(provider.id, $scope.eventDetails.id).then(function (odds) {
                    $scope.providerOdds[provider.id] = odds.data;
                });
            });
        };

        $scope.getEventSelectionsResults = function () {
            resultService.getEventSelectionResult({ event_id: $scope.eventDetails.id }).then(results => {
                $scope.selectionsResults = results.data;
            })
        }

        $scope.getEventSelectionsResults();

        eventMarketService.getEventMarkets($scope.eventDetails.id, $rootScope.langId).then(function (markets) {
            $scope.eventMarkets = markets.data;
            $scope.setSelectionsResults($scope.selectionsResults);
            $scope.loading = false;
        });

        $scope.setSelectionsResults = function (results) {
            $scope.eventMarkets.map(eventMarket => {
                eventMarket.selections.map(eventSelection => {
                    var result = results.find(selectionResult => selectionResult.id == eventSelection.id);
                    if (result) eventSelection.result_type_id = result.result_type_id;
                })
            })
        }

        $scope.onSelectionChange = function (market, selection) {
            let toSet = resultType.CANCEL;
            if (selection.result_type_id == resultType.LOST) toSet = resultType.WIN;
            if (selection.result_type_id == resultType.WIN) toSet = resultType.LOST;
            if (market.multi_winner === false) {
                market.selections.map(s => {
                    if (s !== selection) s.result_type_id = toSet;
                })
            }
        }

        $scope.openScopeResulting = function () {
            $modal.open({
                templateUrl: 'src/app/views/results/eventResulting.html',
                controller: "scopeResultingController",
                size: 'lg',
                resolve: {
                    eventDetails: function () {
                        return eventDetails.data;
                    },
                    scopes: function (settingsService) {
                        return settingsService.scopes(eventDetails.data.sport_id);
                    },
                    statisticTypes: function () {
                        return settingsService.statisticTypes(eventDetails.data.sport_id);
                    },
                    modalMessage: function () {
                        return {
                            message: eventDetails.data.name,
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    }
                },
                scope: $scope
            })
        };
    }
})();