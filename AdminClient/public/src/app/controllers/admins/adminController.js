(function () {
    angular
        .module("app")
        .controller("adminController", adminController);

    adminController.$inject = ['$scope', '$state', '$stateParams', 'userService', 'user', 'permissions'];

    function adminController($scope, $state, $stateParams, userService, user, permissions) {
        $scope.user = user;
        $scope.permissions = permissions;

        $scope.tabs = [
            {
                title: 'permissions',
                content: 'src/app/views/admins/adminPermissions.html'
            }, {
                title: 'logins',
                content: 'src/app/views/admins/adminLogins.html'
            },
            {
                title: 'logs',
                content: 'src/app/views/admins/adminLogs.html'
            }
        ];

        $scope.onPermissionChange = function (permission, checked) {
            if (checked && !user.user_roles.includes(permission)) {
                $scope.user.user_roles.push(permission);
            } else if (!checked) {
                user.user_roles.splice(user.user_roles.indexOf(permission), 1);
            }
        }
    }
})();