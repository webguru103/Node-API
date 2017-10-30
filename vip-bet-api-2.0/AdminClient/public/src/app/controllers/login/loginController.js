(function () {
    angular
        .module("app")
        .controller("loginController", loginController);

    loginController.$inject = ['$scope', 'userService'];

    function loginController($scope, userService) {
        $scope.user = {};
        $scope.login = function () {
            userService.login($scope.user.email, $scope.user.password);
        }
        $scope.logout = function () {
            userService.logout();
        }
    }
})();