/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .controller("editSelectionController", editSelectionController);

    editSelectionController.$inject = ['$scope', '$modalInstance', 'modalMessage', 'selection', 'selections'];

    function editSelectionController($scope, $modalInstance, modalMessage, selection, selections) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.selection = selection;

        $scope.deleteSelection = function () {
            selections.splice(selections.indexOf(selection), 1);
            $modalInstance.close();
        };

        $scope.ok = function () {
            $modalInstance.close();
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }
    }
})();