(function () {
    angular
        .module("app")
        .controller("participantsMappingController", participantsMappingController);

    participantsMappingController.$inject = ['$scope', '$translate', 'providers', 'sports', 'participantsService', 'toastr'];

    function participantsMappingController($scope, $translate, providers, sports, participantsService, toastr) {
        $scope.providers = providers.data;
        $scope.sports = sports.data;
        $scope.filter = { maxPages: 10000, perPage: 150 };
        $scope.participants = [];
        $scope.filter.unmapped = true;
        $scope.sportParticipants = {};

        $scope.onPageChange = function () {
            $scope.loading = true;
            var sportId = $scope.filter.sport.id;
            participantsService.getProviderParticipants($scope.filter.provider.id, sportId, $scope.filter.unmapped, undefined, $scope.filter.currentPage, $scope.filter.perPage).then(function (data) {
                var result = data;
                $scope.participants = result.data;
                $scope.participants.forEach(function (participant) {
                    if (participant.system_participant_id) {
                        participant.systemParticipant = $scope.sportParticipants[sportId].find(function (e) {
                            return e.id == participant.system_participant_id;
                        })
                    }
                })
                $scope.loading = false;
                if ($scope.participants[0]) $scope.filter.totalItems = $scope.participants[0].full_count;
            })
        }

        $scope.findParticipants = function () {
            $scope.filter.currentPage = 1;
            if (!$scope.sportParticipants[$scope.filter.sport.id]) {
                participantsService.list({ sport_id: $scope.filter.sport.id, lang_id: 1 }).then(function (data) {
                    $scope.sportParticipants[$scope.filter.sport.id] = data.data;
                    $scope.onPageChange();
                })
            } else {
                $scope.onPageChange();
            }
        };

        $scope.searchParticipant = function ($select, participant, sportId) {
            participant.searchResult = [];
            if ($select.search.length == 0) return;
            participant.systemParticipant = null;
            participantsService.list({ name: $select.search, sport_id: sportId }).then(function (data) {
                participant.searchResult = data.data;
            })
        }

        $scope.mapParticipant = function (participant) {
            participantsService.updateMapping(participant.systemParticipant.id, participant.id, participant.provider_id).then(function (ok) {
                toastr.success($translate.instant('toastr.mapping.mappingSaved'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }

        $scope.unmapParticipant = function (participant) {
            participantsService.unmapByMapId(participant.id).then(function (ok) {
                participant.systemParticipant = null;
                toastr.success($translate.instant('toastr.mapping.mappingSaved'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }

        $scope.updateParticipantMappings = function () {
            participantsService.updateParticipantMappings().then(function (ok) {
                toastr.success($translate.instant('toastr.mappingsUpdated'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }
    }
})();