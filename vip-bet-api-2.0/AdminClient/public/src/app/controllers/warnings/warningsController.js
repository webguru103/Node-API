/**
 * Created by   on 3/27/2017.
 */
(function () {
    angular
        .module("app")
        .controller("warningsController", warningsController);

    warningsController.$inject = ['$scope', 'warningService', 'warningType'];

    function warningsController($scope, warningService, warningType) {
        $scope.warningsCounts = warningService.warningsCounts;
        $scope.tabs = [
            {
                title: "menu.categories",
                url: "app.mapping.warnings.category",
                type: warningType.category,
                content: 'src/app/views/warnings/categoryMappingWarnings.html'
            },
            {
                title: "menu.participants",
                url: "app.mapping.warnings.participant",
                type: warningType.participant,
                content: 'src/app/views/warnings/participantMappingWarnings.html'
            },
            {
                title: "menu.markets",
                url: "app.mapping.warnings.market",
                type: warningType.market,
                content: 'src/app/views/warnings/marketMappingWarnings.html'
            },
            {
                title: "selections",
                url: "app.mapping.warnings.selection",
                type: warningType.selection,
                content: 'src/app/views/warnings/selectionMappingWarnings.html'
            }
        ];
    }
})();