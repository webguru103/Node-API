/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .controller("deleteParticipantController", deleteParticipantController);

    deleteParticipantController.$inject = ['$scope', '$modalInstance', '$translate', 'modalMessage',
        'participant', 'participants', 'participantsService', 'toastr'];

    function deleteParticipantController($scope, $modalInstance, $translate, modalMessage,
                                         participant, participants, participantsService, toastr) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.ok = function () {
            participantsService.deleteParticipant(participant.id).then(function (ok) {
                for (var i in participants) {
                    if (participants[i].id == participant.id) {
                        participants.splice(i, 1);
                        break;
                    }
                }
                participant = null;
                toastr.success($translate.instant('toastr.participants.deleted'), $translate.instant('toastr.success'));
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