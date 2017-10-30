/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .controller("addEditMarketTemplateController", addEditMarketTemplateController);

    addEditMarketTemplateController.$inject = ['$rootScope', '$scope', '$modal', '$modalInstance', '$translate',
        'sports', 'modalMessage', 'market', 'toastr', 'marketService', 'settingsService', 'markets', 'selectedSportId', 'marketStatus'];

    function addEditMarketTemplateController($rootScope, $scope, $modal, $modalInstance, $translate,
        sports, modalMessage, market, toastr, marketService, settingsService, markets, selectedSportId, marketStatus) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.scopes = [];
        $scope.statisticTypes = [];
        $scope.sports = sports.data;
        $scope.tabs = [
            {
                title: "details",
                content: 'src/app/views/markets/templates/marketDetails.html'
            },
            {
                title: "selections",
                content: 'src/app/views/markets/templates/marketSelections.html'
            }
        ];

        $scope.market = market.data || {};
        if ($scope.market.status_id == marketStatus.ACTIVE) $scope.market.active = true;
        $scope.selected = null;

        if ($scope.market.id != null) {
            for (var i in $scope.sports) {
                var sport = $scope.sports[i];
                if (sport.id == $scope.market.category_id) {
                    $scope.market.sport = sport;
                    break;
                }
            }
            $scope.selections = deParseSelections($scope.market.selections);
        } else {
            $scope.selections = [[{ name: "selection" }]];
            $scope.market.sport = $scope.sports[0];
        }

        $scope.onSportChange = function () {
            settingsService.scopes($scope.market.sport.id).then(data => {
                $scope.scopes = data.data;
                let marketScope = $scope.scopes.find(s => s.id == $scope.market.scope_id);
                if (marketScope && $scope.market.scope_id) $scope.market.scope = marketScope;
            });
            settingsService.statisticTypes($scope.market.sport.id).then(data => {
                $scope.statisticTypes = data.data;
                let statisticType = $scope.statisticTypes.find(s => s.id == $scope.market.statistic_type_id);
                if (statisticType && $scope.market.statistic_type_id) $scope.market.statisticType = statisticType;
            });
        }

        $scope.onSportChange();

        $scope.addSelection = function () {
            $scope.selections[0].push({ name: 'selection' })
        };

        $scope.addSelectionColumn = function () {
            $scope.selections.push([]);
        };

        $scope.openSelectionForEdit = function (selection, selections) {
            $modal.open({
                templateUrl: 'src/app/views/markets/templates/editSelection.html',
                controller: 'editSelectionController',
                size: 'sm',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.markets.editSelection'),
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    },
                    selection: function () {
                        return selection;
                    },
                    selections: function () {
                        return selections;
                    }

                }
            })
        };

        function parseSelections(selections) {
            var selectionsForSave = [];
            angular.forEach(selections, function (selectionsColumn, column_index) {
                angular.forEach(selectionsColumn, function (selection, row_index) {
                    selectionsForSave.push({
                        row_index: row_index + 1,
                        column_index: column_index + 1,
                        name: selection.name,
                        id: selection.id || null,
                        dict_id: selection.dict_id
                    })
                });
            });
            return selectionsForSave;
        }

        function deParseSelections(selections) {
            var selectionsToReturn = [];
            angular.forEach(selections, function (selection) {
                if (!(selectionsToReturn[selection.column_index - 1] instanceof Array)) {
                    selectionsToReturn[selection.column_index - 1] = [];
                }
                selectionsToReturn[selection.column_index - 1][selection.row_index - 1] = selection;
            });
            return selectionsToReturn;
        }

        $scope.ok = function () {
            var selections = parseSelections($scope.selections);
            var categoryId = $scope.market.sport.id;
            var langId = $rootScope.langId;
            var name = $scope.market.name;

            var marketToSend = {
                category_id: categoryId,
                name: name,
                lang_id: langId,
                selections: selections,
                id: $scope.market.id,
                is_tipster: $scope.market.is_tipster,
                is_tipster_default: $scope.market.is_tipster_default,
                status_id: $scope.market.active ? marketStatus.ACTIVE : marketStatus.HIDE || marketStatus.ACTIVE,
                multi_winner: $scope.market.multi_winner,
                scope_id: $scope.market.scope ? $scope.market.scope.id : $scope.market.scope_id,
                statistic_type_id: $scope.market.statisticType ? $scope.market.statisticType.id : $scope.market.statistict_type_id
            };

            if (marketToSend.id == null) {
                marketService.add(marketToSend).then(function (ok) {
                    if (selectedSportId == categoryId) {
                        marketToSend.id = ok.data;
                        markets.push(marketToSend);
                    }
                    toastr.success($translate.instant("toastr.market.added"), $translate.instant("toastr.success"));
                    $modalInstance.close();
                }, function (error) {
                    toastr.error(error.data, $translate.instant("toastr.error"));
                })
            } else {
                marketService.update(marketToSend).then(function (ok) {
                    for (var i in markets) {
                        if (markets[i].id == marketToSend.id
                            && marketToSend.lang_id == $rootScope.langId) {
                            markets[i].name = marketToSend.name;
                            markets[i].status_id = marketToSend.status_id;
                            break;
                        }
                    }
                    toastr.success($translate.instant("toastr.market.updated"), $translate.instant("toastr.success"));
                    $modalInstance.close();
                }, function (error) {
                    toastr.error(error.data, $translate.instant("toastr.error"));
                })
            }
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
})();