(function () {
    angular
        .module("app")
        .controller("betslipsController", betslipsController);

    betslipsController.$inject = ['$scope', '$rootScope', '$modal', '$translate', 'betslipsService', 'betslipStatus', 'betslipType', 'events', 'toastr'];

    function betslipsController($scope, $rootScope, $modal, $translate, betslipsService, betslipStatus, betslipType, events, toastr) {
        $scope.betslipStatus = betslipStatus;
        $scope.betslipType = betslipType;
        $scope.statuses = [
            {
                name: "all"
            },
            {
                id: betslipStatus.ACTIVE,
                name: betslipStatus[betslipStatus.ACTIVE]
            },
            {
                id: betslipStatus.WIN,
                name: betslipStatus[betslipStatus.WIN]
            },
            {
                id: betslipStatus.HALF_WIN,
                name: betslipStatus[betslipStatus.HALF_WIN]
            },
            {
                id: betslipStatus.CANCELLED,
                name: betslipStatus[betslipStatus.CANCELLED]
            },
            {
                id: betslipStatus.LOST,
                name: betslipStatus[betslipStatus.LOST]
            }
        ];

        $scope.filter = betslipsService.filter;
        $scope.filter.maxPages = 10000;
        $scope.filter.perPage = 150;
        if (!$scope.filter.currentPage) $scope.filter.currentPage = 1;
        if (!$scope.filter.status) $scope.filter.status = $scope.statuses[0];

        $scope.datePicker = {};
        $scope.datePicker.date = { startDate: moment().subtract(6, 'month'), endDate: moment() };

        $scope.betslips = [];

        $scope.searchBetslips = function () {
            $scope.filter.currentPage = 1;
            $scope.onPageChange();
        };

        $scope.onPageChange = function () {
            $scope.loading = true;
            $scope.betslips.length = 0;
            betslipsService.list(
                moment($scope.datePicker.date.startDate.startOf('day')).format("YYYY-MM-DD HH:mm:ss"),
                moment($scope.datePicker.date.endDate.endOf('day')).format("YYYY-MM-DD HH:mm:ss"),
                $scope.filter.status.id,
                $scope.filter.awaiting_result,
                $scope.filter.currentPage,
                $scope.filter.perPage)
                .then(function (data) {
                    $scope.betslips.push.apply($scope.betslips, data.data);
                    if ($scope.betslips[0]) $scope.filter.totalItems = $scope.betslips[0].full_count;
                    $scope.loading = false;
                }, function (error) {
                    $scope.loading = false;
                    toastr.error(error.data, $translate.instant('toast.error'))
                });
        };

        $scope.getBetSlipEventNames = function (details) {
            return details.map(d => d.event_name).reduce((result, next) => {
                if (result.includes(next)) return result;
                result.push(next);
                return result;
            }, []).join("|");
        }

        $scope.getBetSlipType = function (betslip) {
            var typeString = $translate.instant(betslipType[betslip.type_id]);
            if (betslip.type_id == betslipType.EXPRESS || betslip.type_id == betslipType.SYSTEM) {
                typeString += `(${betslip.details.length})`
            }
            return typeString;
        }

        $scope.searchBetslips();

        $scope.openBetslip = function (betslip) {
            $modal.open({
                templateUrl: 'src/app/views/betslips/betslip.html',
                controller: "betslipController",
                size: 'lg',
                resolve: {
                    betslip: function () {
                        return betslip;
                    }
                }
            })
        };

        $rootScope.$on(events.betslip.updated, function (event, data) {
            $scope.betslips = $scope.betslips.map(function (betslip) {
                if (betslip.id === data.id) betslip = data;
                return betslip;
            })
        });
    }
})();