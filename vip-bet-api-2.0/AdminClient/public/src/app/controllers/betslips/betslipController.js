(function () {
    angular
        .module("app")
        .controller("betslipController", betslipController);

    betslipController.$inject = ['$scope', '$rootScope', '$translate', 'betslip', 'betslipsService', 'betslipDetailService', 'betslipStatus', 'resultType', 'betslipType', 'moneyType', 'events', '$modalInstance'];

    function betslipController($scope, $rootScope, $translate, betslip, betslipsService, betslipDetailService, betslipStatus, resultType, betslipType, moneyType, events, $modalInstance) {
        $scope.moneyType = moneyType;
        $scope.betslipStatus = betslipStatus;
        $scope.betslipType = betslipType;
        $scope.resultType = resultType;
        $scope.betslip = betslip;

        $scope.cancelBetslip = function () {
            var data = Object.assign({}, $scope.betslip, {
                status_id: $scope.betslipStatus.CANCELLED,
            });
            updateBetslip(data);
        };
        $scope.uncancelBetslip = function () {
            var data = Object.assign({}, $scope.betslip, {
                status_id: $scope.betslipStatus.ACTIVE,
            });
            updateBetslip(data);
        };

        $scope.cancelBetslipDetail = function (detail) {
            var data = Object.assign({}, detail, {
                status_id: $scope.betslipStatus.CANCELLED,
            });
            updateBetslipDetail(data);
        };

        $scope.uncancelBetslipDetail = function (detail) {
            var data = Object.assign({}, detail);

            switch (data.result_type_id) {
                case $scope.resultType.WIN:
                    data.status_id = $scope.betslipStatus.WIN;
                    break;
                case $scope.resultType.LOST:
                    data.status_id = $scope.betslipStatus.LOST;
                    break;
                case $scope.resultType.CANCEL:
                    data.status_id = $scope.betslipStatus.CANCELLED;
                    break;
                default:
                    data.status_id = $scope.betslipStatus.ACTIVE;
                    break;
            }

            updateBetslipDetail(data);
        };

        $scope.getBetSlipType = function (betslip) {
            var typeString = $translate.instant(betslipType[betslip.type_id]);
            if (betslip.type_id == betslipType.EXPRESS || betslip.type_id == betslipType.SYSTEM) {
                typeString += `(${betslip.details.length})`
            }
            return typeString;
        };

        $scope.closeModal = function () {
            $modalInstance.dismiss();
        };

        function updateBetslipDetail(data) {
            return betslipDetailService.update(data)
                .then(function (res) {
                    $scope.betslip = res.data;

                });
        }

        function updateBetslip(data) {
            return betslipsService.update(data)
                .then(function (res) {
                    $scope.betslip = res.data;
                    emitUpdatedBetslip($scope.betslip);
                });
        }

        function emitUpdatedBetslip(betslip) {
            $rootScope.$emit(events.betslip.updated, betslip);
        }
    }
})();