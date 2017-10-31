/**
 * Created by   on 3/27/2017.
 */
(function () {
    angular
        .module("app")
        .controller("categoryWarningsController", categoryWarningsController);

    categoryWarningsController.$inject = ['$scope', 'warningService', 'warningType', 'toastr'];

    function categoryWarningsController($scope, warningService, warningType, toastr) {
        var type = warningType.category;
        $scope.warnings = warningService.warnings[type];

        $scope.maxPages = 10000;
        $scope.perPage = 100;
        $scope.currentPage = 1;
        if($scope.warnings[0])$scope.totalItems = $scope.warnings[0].full_count;

        $scope.onPageChange = function () {
            $scope.loading = true;
            warningService.getWarningsByType(type, ($scope.currentPage - 1) * $scope.perPage, $scope.perPage)
                .then(function () {
                    if($scope.warnings[0])$scope.totalItems = $scope.warnings[0].full_count;
                    $scope.loading = false;
                }, function (error) {
                    $scope.loading = false;
                    toastr.error(error.data, $translate.instant('toast.error'))
                });
        };
    }
})();