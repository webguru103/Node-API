/**
 * Created by   on 3/18/2017.
 */
(function () {
    angular
        .module("app")
        .controller("participantsLeagueController", participantsLeagueController);

    participantsLeagueController.$inject = ['$rootScope', '$scope', '$modalInstance', '$translate', 'modalMessage',
        'selectedParticipant', 'participantsService', 'toastr', 'countries', 'categoryService', 'leagues'];

    function participantsLeagueController($rootScope, $scope, $modalInstance, $translate, modalMessage,
        selectedParticipant, participantsService, toastr, countries, categoryService, leagues) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.countries = countries.data;
        $scope.participantLeagues = leagues.data || [];

        $scope.addLeague = function () {
            $scope.participantLeagues.push({})
        };

        $scope.deleteLeague = function (league) {
            $scope.participantLeagues.splice($scope.participantLeagues.indexOf(league), 1);
        };

        $scope.onCountryChange = function (country, row) {
            categoryService.getCategories({ id: country.id, lang_id: $rootScope.langId }).then(function (leagues) {
                row.leagues = leagues.data;
            });
        };

        $scope.ok = function () {
            var leagues = $scope.participantLeagues.map(league => {
                return { league_id: league.league.id, country_id: league.country.id };
            });

            participantsService.updateParticipantLeagues(selectedParticipant.id, leagues).then(function (ok) {
                toastr.success($translate.instant('toastr.participants.updated'), $translate.instant('toastr.success'));
                $modalInstance.close();
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
})();