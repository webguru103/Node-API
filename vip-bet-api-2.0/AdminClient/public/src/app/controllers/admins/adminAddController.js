(function () {
    angular
        .module("app")
        .controller("adminAddController", adminAddController);

    adminAddController.$inject = ['$scope', '$state', '$stateParams', '$translate', '$modalInstance', 'userService', 'modalMessage', 'permissions', 'toastr'];

    function adminAddController($scope, $state, $stateParams, $translate, $modalInstance, userService, modalMessage, permissions, toastr) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.user = {
            user_roles: []
        };

        $scope.permissions = permissions;

        $scope.ok = function () {
            userService.addAdmin($scope.user).then(function (data) {
                toastr.success($translate.instant("toastr.added"), $translate.instant("toastr.success"));
                $modalInstance.close();
            }, function (error) {
                toastr.error(error.data, $translate.instant("toastr.error"));
            })
        }

        $scope.cancel = function () {
            $modalInstance.dismiss();
        }

        $scope.onPermissionChange = function (permission, checked) {
            if (checked && !$scope.user.user_roles.includes(permission)) {
                $scope.user.user_roles.push(permission);
            } else if (!checked) {
                $scope.user.user_roles.splice($scope.user.user_roles.indexOf(permission), 1);
            }
        }
    }
})();