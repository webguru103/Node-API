/**
 * Created by   on 3/10/2017.
 */
(function () {
    angular
        .module("app")
        .controller("participantMappingController", participantMappingController);

    participantMappingController.$inject = ['$scope', '$modalInstance', '$translate',
        'modalMessage', 'selectedParticipant', 'participantsService', 'toastr', 'providers', 'selectedSport'];

    function participantMappingController($scope, $modalInstance, $translate, modalMessage,
        selectedParticipant, participantsService, toastr, providers, selectedSport) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.selectedSport = selectedSport;
        $scope.providers = providers.data;
        $scope.selectedParticipant = selectedParticipant;
        $scope.mappings = [];

        $scope.onProviderChange = function () {
            $scope.mappings.length = 0;

            participantsService.listMappings($scope.provider.id, $scope.selectedParticipant.id).then(data => {
                $scope.mappings = data.data;
                if (!$scope.mappings.length) return;
                $scope.mappings.forEach(function (map) {
                    map.providerParticipant = {};
                    angular.copy(map, map.providerParticipant);
                });

                if ($scope.mappings.length == 0) {
                    $scope.mappings.push({ providerParticipant: {} })
                }
            });

        };

        $scope.searchParticipant = function ($select) {
            $scope.unmapped = [];
            if ($select.search.length == 0) return;
            participantsService.getProviderParticipants($scope.provider.id, $scope.selectedSport.id, true, $select.search).then(function (data) {
                $scope.unmapped = data.data;
            });
        }

        $scope.onAddMapping = function () {
            $scope.mappings.push({
                systemParticipantId: $scope.selectedParticipant.id,
                systemParticipantName: $scope.selectedParticipant.name,
                providerParticipantName: "",
                providerParticipantId: null
            })
        };

        $scope.removeMapping = function (map) {
            $scope.mappings.splice($scope.mappings.indexOf(map), 1);
        };

        $scope.ok = function () {
            var mappings = [];
            $scope.mappings.forEach(function (map) {
                mappings.push(map.providerParticipant.id);
            });

            var maps = mappings.map(m => { return { id: m, provider_id: $scope.provider.id } });

            participantsService.mapParticipant(selectedParticipant.id, maps).then(function (ok) {
                toastr.success($translate.instant('toastr.mapping.mappingSaved'), $translate.instant('toastr.success'));
                $modalInstance.close();
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();