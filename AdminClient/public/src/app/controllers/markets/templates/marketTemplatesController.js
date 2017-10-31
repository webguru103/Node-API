/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .controller("marketTemplatesController", marketTemplatesController);

    marketTemplatesController.$inject = ['$rootScope', '$scope', '$modal', '$translate', 'sports', 'providers', 'marketService', 'commonService', 'toastr', 'marketStatus', 'userService'];

    function marketTemplatesController($rootScope, $scope, $modal, $translate, sports, providers, marketService, commonService, toastr, marketStatus, userService) {
        $scope.sports = sports.data;
        providers.data.unshift({ name: "selectProvider" });
        $scope.providers = providers.data;
        $scope.permissions = userService.permissions;
        $scope.filter = {};

        $scope.markets = [];

        $scope.addMarketTemplate = function () {
            $modal.open({
                templateUrl: 'src/app/views/markets/templates/addEditMarketTemplate.html',
                controller: "addEditMarketTemplateController",
                size: 'lg',
                resolve: {
                    sports: function () {
                        return sports;
                    },
                    selectedSportId: function () {
                        return $scope.filter.sport.id;
                    },
                    markets: function () {
                        return $scope.markets;
                    },
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.markets.addMarketTemplate'),
                            yes: $translate.instant('add'),
                            no: $translate.instant('cancel')
                        }
                    },
                    market: function () {
                        return {};
                    }
                }
            })
        };

        $scope.updateMarketTemplate = function (market) {
            $modal.open({
                templateUrl: 'src/app/views/markets/templates/addEditMarketTemplate.html',
                controller: "addEditMarketTemplateController",
                size: 'lg',
                resolve: {
                    sports: function () {
                        return sports;
                    },
                    selectedSportId: function () {
                        return $scope.filter.sport.id;
                    },
                    markets: function () {
                        return $scope.markets;
                    },
                    market: function () {
                        return marketService.getById(market.id, $rootScope.langId);
                    },
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.markets.editMarketTemplate'),
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    }
                }
            })
        };

        $scope.updateMarketMapping = function (market) {
            $modal.open({
                templateUrl: 'src/app/views/markets/templates/marketMapping.html',
                controller: "marketMappingController",
                size: 'md',
                resolve: {
                    providers: function () {
                        return commonService.getProviders();
                    },
                    selectedMarket: function (marketService) {
                        return marketService.getById(market.id, $rootScope.langId);
                    },
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.markets.marketMapping'),
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    }
                }
            })
        };

        $scope.searchMarkets = function () {
            marketService.list($scope.filter.sport.id, $scope.filter.name, $rootScope.langId, $scope.filter.showActive ? marketStatus.ACTIVE : undefined, false).then(function (markets) {
                $scope.markets = markets.data;
            })
        };

        $scope.deleteMarket = function (market) {
            $modal.open({
                templateUrl: 'src/app/views/common/yesNoModal.html',
                controller: "deleteMarketController",
                size: 'sm',
                resolve: {
                    market: function () {
                        return market;
                    },
                    markets: function () {
                        return $scope.markets;
                    },
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.markets.deleteMarketTemplate'),
                            yes: $translate.instant('delete'),
                            no: $translate.instant('cancel')
                        }
                    }
                }
            })
        };

        $scope.sortingUpdated = false;
        $scope.sortableOptions = {
            start: function () {
                $scope.sortingUpdated = false;
            },
            update: function (e, ui) {
                $scope.sortingUpdated = true;
            },
            stop: function (e, ui) {
                if ($scope.sortingUpdated) {
                    var orders = $scope.markets.map(function (market, index) {
                        return { id: market.id, order_id: index }
                    });
                    marketService.updateMany(orders).then(function (ok) {
                        toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
                    }, function (error) {
                        toastr.error(error.data, $translate.instant('toastr.error'));
                    });
                }
            }
        }

        $scope.showHideMarket = function (market) {
            var marketToSend = Object.assign({}, market);
            marketToSend.status_id = marketToSend.status_id == marketStatus.ACTIVE ? marketStatus.HIDE : marketStatus.ACTIVE
            marketService.update(marketToSend).then(function (data) {
                market.status_id = marketToSend.status_id;
                toastr.success($translate.instant('toastr.market.updated'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }
    }
})();