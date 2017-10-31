/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .controller("editParticipantController", editParticipantController);

    editParticipantController.$inject = ['$rootScope', '$scope', '$modalInstance', '$translate', '$q', 'modalMessage',
        'selectedParticipant', 'participantsService', 'toastr', 'mediaService'];

    function editParticipantController($rootScope, $scope, $modalInstance, $translate, $q, modalMessage,
        selectedParticipant, participantsService, toastr, mediaService) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;
        $scope.icon = {};

        $scope.participant = {};

        angular.copy(selectedParticipant, $scope.participant);

        if ($scope.participant.icon_url) $scope.participant.icon_url = $scope.participant.icon_url.replace(/\\/, "/");

        $scope.ok = function () {
            mediaService.uploadImage($scope.icon.file || selectedParticipant.icon_url).then(function (fileName) {
                participantsService.updateParticipant(selectedParticipant.id, $scope.participant.name, $rootScope.langId, fileName.file, fileName.file_small).then(function (ok) {
                    selectedParticipant.name = $scope.participant.name;
                    selectedParticipant.text = $scope.participant.name;
                    selectedParticipant.icon_url = fileName.file;
                    selectedParticipant.icon_small_url = fileName.file_small;

                    toastr.success($translate.instant('toastr.participants.updated'), $translate.instant('toastr.success'));
                    $modalInstance.close();
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                })
            });
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.onImageChange = function (files, participant) {
            if (files[0] == undefined) return;
            $scope.fileExt = files[0].name.split(".").pop();
            if ($scope.fileExt.toLocaleLowerCase().match(/^(jpg|jpeg|gif|png|svg)$/)) {
                participant.isImage = true;
            }
            else {
                participant.isImage = false;
            }
        };
    }
})();