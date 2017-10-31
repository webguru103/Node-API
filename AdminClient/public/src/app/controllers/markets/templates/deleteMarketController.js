/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .controller("deleteMarketController", deleteMarketController);

    deleteMarketController.$inject = ['$scope', '$modalInstance', '$translate', 'modalMessage', 'markets', 'market', 'marketService', 'toastr'];

    function deleteMarketController($scope, $modalInstance, $translate, modalMessage, markets, market, marketService, toastr) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.market = market;

        $scope.ok = function () {
            marketService.remove(market.id).then(function () {
                markets.splice(markets.indexOf(market), 1);
                toastr.success($translate.instant("toastr.market.deleted"), $translate.instant("toastr.success"));
                $modalInstance.close();
            }, function (error) {
                toastr.success(error.data, $translate.instant("toastr.error"));
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
})();