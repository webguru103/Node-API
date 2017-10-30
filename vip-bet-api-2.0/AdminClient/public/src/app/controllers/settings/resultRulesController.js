(function () {
    angular
        .module("app")
        .controller("resultRulesController", resultRulesController);

    resultRulesController.$inject = ['$rootScope', '$scope', '$translate', 'settingsService', 'marketService', 'sports', 'toastr'];

    function resultRulesController($rootScope, $scope, $translate, settingsService, marketService, sports, toastr) {
        $scope.sports = sports.data;
        $scope.filter = {};
        $scope.scopes = [];
        $scope.markets = [];
        $scope.loading = false;
        $scope.marketsLoading = true;
        // search scopes
        $scope.search = function () {
            $scope.markets.length = 0;
            $scope.marketsLoading = true;
            $scope.market = undefined;
            marketService.list($scope.filter.sport.id, $scope.filter.name, $rootScope.langId, undefined, true).then(markets => {
                $scope.markets = markets.data;
                $scope.marketsLoading = false;
            })
        }

        $scope.loadSelectionsRules = function (market) {
            if ($scope.market) $scope.market.selected = false;
            $scope.market = market;
            $scope.market.selected = true;
            $scope.loading = true;
            settingsService.getRules({ market_id: market.id }).then(rules => {
                $scope.loading = false;
                $scope.market.selections.map(s => Object.assign(s, rules.data.find(r => r.id == s.id)))
            })
        }

        $scope.updateRules = function (selections) {
            let rulesToSave = selections.map(s => {
                return {
                    id: s.id,
                    market_id: s.market_id,
                    rule: s.rule,
                    cancel_rule: s.cancel_rule
                }
            });
            settingsService.addRules(rulesToSave).then(rules => {
                toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }
    }
})()