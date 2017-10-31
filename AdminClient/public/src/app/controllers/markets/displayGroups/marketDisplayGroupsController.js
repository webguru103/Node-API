/**
 * Created by   on 4/8/2017.
 */
(function () {
    angular
        .module("app")
        .controller("marketDisplayGroupsController", marketDisplayGroupsController);

    marketDisplayGroupsController.$inject = ['$scope', 'sports'];

    function marketDisplayGroupsController($scope, sports) {
        $scope.sports = sports;
    }
})();