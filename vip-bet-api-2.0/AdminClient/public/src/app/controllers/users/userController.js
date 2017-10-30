(function () {
    angular
        .module("app")
        .controller("userController", userController);

    userController.$inject = ['$scope', 'userService'];

    function userController($scope, userService) {
        
    }
})();