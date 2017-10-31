/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .controller("addParticipantController", addParticipantController);

    addParticipantController.$inject = ['$rootScope', '$scope', '$modalInstance', '$translate', '$q', 'modalMessage',
        'participants', 'sportId', 'participantsService', 'toastr', 'mediaService'];

    function addParticipantController($rootScope, $scope, $modalInstance, $translate, $q, modalMessage,
        participants, sportId, participantsService, toastr, mediaService) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;
        $scope.participant = {};
        $scope.icon = {};

        $scope.ok = function () {
            mediaService.uploadImage($scope.icon.file).then(function (fileName) {
                participantsService.addParticipant($scope.participant.name, $rootScope.langId, sportId, fileName.file, fileName.file_small).then(function (ok) {
                    participants.unshift({
                        id: ok.data.id,
                        text: $scope.participant.name,
                        name: $scope.participant.name,
                        sport_id: sportId,
                        icon_url: fileName.file,
                        icon_small_url: fileName.file_small,
                    });

                    toastr.success($translate.instant('toastr.participants.added'), $translate.instant('toastr.success'));
                    $modalInstance.close();
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                })
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();