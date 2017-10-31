(function () {
    angular
        .module("app")
        .controller("statisticTypesController", statisticTypesController);

    statisticTypesController.$inject = ['$rootScope', '$scope', '$translate', 'settingsService', 'sports', 'toastr'];

    function statisticTypesController($rootScope, $scope, $translate, settingsService, sports, toastr) {
        $scope.sports = sports.data;
        $scope.filter = {};
        $scope.statisticTypes = [];
        $scope.loading = true;
        // search statistic types
        $scope.search = function () {
            $scope.loading = true;
            settingsService.statisticTypes($scope.filter.sport.id, $scope.filter.name).then(function (statisticTypes) {
                $scope.statisticTypes = statisticTypes.data;
                $scope.loading = false;
            })
        }

        $scope.sortableOptions = {
            start: function () {
                $scope.sortingUpdated = false;
            },
            update: function (e, ui) {
                $scope.sortingUpdated = true;
            },
            stop: function (e, ui) {
                if ($scope.sortingUpdated) {
                    var orders = $scope.statisticTypes.map(function (stype, index) {
                        return { id: stype.id, order_id: index }
                    });
                    settingsService.updateStatisticTypes(orders).then(function (ok) {
                        toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
                    }, function (error) {
                        toastr.error(error.data, $translate.instant('toastr.error'));
                    });
                }
            }
        }

        $scope.add = function () {
            $scope.statisticTypes.push({ name: "", sport_id: $scope.filter.sport.id });
        };

        $scope.update = function (statisticType) {
            if (statisticType.id) {
                settingsService.updateStatisticType(statisticType).then(function () {
                    toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                })
            } else {
                settingsService.addStatisticType(statisticType).then(function (addedStatisticType) {
                    statisticType.id = addedStatisticType.data.id;
                    toastr.success($translate.instant('toastr.added'), $translate.instant('toastr.success'));
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                });
            }
        };

        $scope.delete = function (statisticType) {
            if (statisticType.id) {
                settingsService.deleteStatisticType(statisticType).then(function () {
                    toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
                    $scope.statisticTypes.splice($scope.statisticTypes.indexOf(statisticType), 1);
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                })
            } else {
                $scope.statisticTypes.splice($scope.statisticTypes.indexOf(statisticType), 1);
            }
        };
    }
})()