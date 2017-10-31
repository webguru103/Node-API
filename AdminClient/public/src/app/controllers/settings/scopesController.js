(function () {
    angular
        .module("app")
        .controller("scopesController", scopesController);

    scopesController.$inject = ['$rootScope', '$scope', '$translate', 'settingsService', 'sports', 'toastr'];

    function scopesController($rootScope, $scope, $translate, settingsService, sports, toastr) {
        $scope.sports = sports.data;
        $scope.filter = {};
        $scope.scopes = [];
        $scope.loading = true;
        // search scopes
        $scope.search = function () {
            $scope.loading = true;
            settingsService.scopes($scope.filter.sport.id, $scope.filter.name).then(function (scopes) {
                $scope.scopes = scopes.data;
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
                    var orders = $scope.scopes.map(function (scope, index) {
                        return { id: scope.id, order_id: index }
                    });
                    settingsService.updateScopes(orders).then(function (ok) {
                        toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
                    }, function (error) {
                        toastr.error(error.data, $translate.instant('toastr.error'));
                    });
                }
            }
        }

        $scope.add = function () {
            $scope.scopes.push({ name: "", sport_id: $scope.filter.sport.id });
        };

        $scope.update = function (scope) {
            if (scope.id) {
                settingsService.updateScope(scope).then(function () {
                    toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                })
            } else {
                settingsService.addScope(scope).then(function (addedScope) {
                    scope.id = addedScope.data.id;
                    toastr.success($translate.instant('toastr.added'), $translate.instant('toastr.success'));
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                });
            }
        };

        $scope.delete = function (scope) {
            if (scope.id) {
                settingsService.deleteScope(scope).then(function () {
                    toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
                    $scope.scopes.splice($scope.scopes.indexOf(scope), 1);
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                })
            } else {
                $scope.scopes.splice($scope.scopes.indexOf(scope), 1);
            }
        };
    }
})()