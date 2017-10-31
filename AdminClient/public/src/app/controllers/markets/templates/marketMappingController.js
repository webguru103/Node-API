/**
 * Created by   on 3/12/2017.
 */
(function () {
    angular
        .module("app")
        .controller("marketMappingController", marketMappingController);

    marketMappingController.$inject = ['$scope', 'marketService', '$translate', '$modalInstance',
        'modalMessage', 'selectedMarket', 'toastr', 'providers', 'categoryService'];

    function marketMappingController($scope, marketService, $translate, $modalInstance,
        modalMessage, selectedMarket, toastr, providers, categoryService) {

        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.providers = providers.data;
        $scope.selectedMarket = selectedMarket.data;
        $scope.mappings = [];

        $scope.onAddMapping = function () {
            $scope.mappings.push({
                systemMarketId: $scope.selectedMarket.id,
                systemMarketName: $scope.selectedMarket.name,
                providerMarketName: "",
                providerMarketId: null
            })
        };

        $scope.onProviderChange = function () {
            $scope.mappings.length = 0;

            $scope.selectedMap = null;

            categoryService.getCategoryMappingsByProviderId($scope.selectedMarket.category_id, $scope.provider.id).then(function (mapped) {
                if (mapped.data.length == 0) {
                    return;
                }

                marketService.getMarketMappingsByProviderId($scope.selectedMarket.id, $scope.provider.id).then(function (data) {
                    $scope.mappings = data.data;

                    $scope.mappings.forEach(function (map) {
                        map.providerMarket = {};
                        angular.copy(map, map.providerMarket);
                    });

                    if ($scope.mappings.length == 0) {
                        $scope.mappings.push({ providerMarket: {} })
                    }

                    if ($scope.mappings.length > 0) $scope.selectMarket($scope.mappings[0]);
                });
                marketService.getUnmappedMarketsByProviderIdAndSportId($scope.selectedMarket.category_id, $scope.provider.id).then(function (data) {
                    $scope.unmappedMarkets = data.data;
                });
            });
        };

        $scope.removeMapping = function (map) {
            $scope.mappings.splice($scope.mappings.indexOf(map), 1);
        };

        $scope.ok = function () {
            var marketMappings = [];
            var selectionMappings = [];

            $scope.mappings.forEach(function (market) {
                marketMappings.push(market.providerMarket.id);

                if (market.selectionMappings) {
                    market.selectionMappings.forEach(function (selection) {
                        if (selection.systemSelection) {
                            selectionMappings.push({ systemSelectionId: selection.systemSelection.id, mapId: selection.id });
                        }
                    });
                }
            });

            marketService.mapMarketWithSelections($scope.provider.id, $scope.selectedMarket.id, marketMappings, selectionMappings).then(function (ok) {
                toastr.success($translate.instant('toastr.mapping.mappingSaved'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.selectMarket = function (market) {
            if ($scope.selectedMap) $scope.selectedMap.selected = false;
            $scope.selectedMap = market;
            $scope.selectedMap.selected = true;
            if (!$scope.selectedMap.selectionMappings) $scope.selectedMap.selectionMappings = [];
            // $scope.selectionMappings = [];

            if (!$scope.selectedMap.providerMarket) return;
            marketService.getSelectionsMappingsByProviderIdAndMarketId($scope.selectedMap.providerMarket.provider_id,
                $scope.selectedMap.providerMarket.provider_market_id, $scope.selectedMarket.category_id).then(function (mappings) {
                    // $scope.selectionMappings = mappings.data;
                    mappings.data.forEach(function (mapping) {
                        var oldMapping = $scope.selectedMap.selectionMappings.find(m => { return m.id == mapping.id });
                        if (oldMapping) return;
                        $scope.selectedMap.selectionMappings.push(mapping);
                        if (mapping.system_selection_id) {
                            $scope.selectedMarket.selections.forEach(function (systemMarket) {
                                if (systemMarket.id == mapping.system_selection_id) {
                                    mapping.systemSelection = systemMarket;
                                }
                            })
                        }
                    })
                })
        }
    }
})();