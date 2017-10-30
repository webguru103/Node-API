/**
 * Created by   on 3/19/2017.
 */
(function () {
    angular
        .module("app")
        .controller("scopeResultingController", scopeResultingController);

    scopeResultingController.$inject = ['$rootScope', '$scope', '$interval', '$modalInstance', '$translate', 'settingsService', 'resultService',
        'eventStatus', 'scopes', 'statisticTypes', 'eventDetails', 'modalMessage', 'toastr'];

    function scopeResultingController($rootScope, $scope, $interval, $modalInstance, $translate, settingsService, resultService,
        eventStatus, scopes, statisticTypes, eventDetails, modalMessage, toastr) {
        $scope.eventDetails = eventDetails;
        $scope.loading = true;
        $scope.eventStatus = eventStatus;
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;
        $scope.statisticTypes = statisticTypes.data;
        $scope.scopes = scopes.data;
        var selectedScope;
        $scope.tabs = scopes.data.map(scope => {
            return {
                title: scope.name,
                id: scope.id,
                content: 'src/app/views/results/scopeResulting.html'
            }
        })

        $scope.onTabChange = function (tab, reload = false) {
            if (tab === selectedScope && !reload) return;
            selectedScope = tab;
            $scope.loading = true;
            statisticTypes.data.map(st => {
                st.home = undefined;
                st.away = undefined;
            })

            if ($scope.eventResult && $scope.eventResult.results) {
                $scope.eventResult.results.filter(r => r.scope_id == selectedScope.id).map(result => {
                    var statistic = statisticTypes.data.find(st => st.id == result.statistic_type_id);
                    statistic.home = result.scores[0].score;
                    statistic.away = result.scores[1].score;
                })
            }
        }

        resultService.getEventResult({ id: eventDetails.id }).then(results => {
            $scope.eventResult = results.data[0] || {};
            $scope.onTabChange(selectedScope, true);

        });

        $scope.onTabChange($scope.tabs[0]);

        $scope.onStatScoreChange = function (statistic) {
            if (!$scope.eventResult.results) $scope.eventResult.results = [];
            var statisticToChange = $scope.eventResult.results.find(r => r.scope_id == selectedScope.id && r.statistic_type_id == statistic.id);
            if (statisticToChange !== undefined) {
                if (!statisticToChange.scores) statisticToChange.scores = [];
                statisticToChange.scores[0].score = statistic.home || 0;
                statisticToChange.scores[1].score = statistic.away || 0;
            } else {
                $scope.eventResult.id = eventDetails.id;
                $scope.eventResult.results.push({
                    scope_id: selectedScope.id,
                    statistic_type_id: statistic.id,
                    scores: [{
                        participant_id: eventDetails.participants[0],
                        score: statistic.home
                    }, {
                        participant_id: eventDetails.participants[1],
                        score: statistic.away
                    }]
                })
            }
        }

        $scope.ok = function () {
            resultService.updateEventResult($scope.eventResult).then(data => {
                $scope.setSelectionsResults(data.data);
                toastr.success($translate.instant("toastr.updated"), $translate.instant("toastr.success"));
                $modalInstance.close();
            }, function (error) {
                toastr.error(error.data, $translate.instant("toastr.error"));
            })
        }

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
})();