/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .factory("settingsService", settingsService);

    settingsService.$inject = ['apiService'];

    function settingsService(apiService) {
        return {
            scopes: scopes,
            addScope: addScope,
            updateScope: updateScope,
            updateScopes: updateScopes,
            deleteScope: deleteScope,
            statisticTypes: statisticTypes,
            addStatisticType: addStatisticType,
            updateStatisticType: updateStatisticType,
            updateStatisticTypes: updateStatisticTypes,
            deleteStatisticType: deleteStatisticType,
            addRules: addRules,
            getRules: getRules,
            deleteRules: deleteRules
        };

        function scopes(sport_id, name) {
            return apiService.request({
                method: "GET",
                url: "/scopes",
                params: {
                    sport_id: sport_id,
                    name: name
                }
            });
        }

        function addScope(scope) {
            return apiService.request({
                method: "POST",
                url: `/scope`,
                data: scope
            });
        }

        function updateScope(scope) {
            return apiService.request({
                method: "POST",
                url: `/scopes/${scope.id}`,
                data: scope
            });
        }

        function updateScopes(scopes) {
            return apiService.request({
                method: "POST",
                url: `/scopes`,
                data: scopes
            });
        }

        function deleteScope(scope) {
            return apiService.request({
                method: "DELETE",
                url: `/scope/${scope.id}`
            });
        }

        function statisticTypes(sport_id, name) {
            return apiService.request({
                method: "GET",
                url: "/statisticTypes",
                params: {
                    sport_id: sport_id,
                    name: name
                }
            });
        }

        function addStatisticType(statType) {
            return apiService.request({
                method: "POST",
                url: `/statisticType`,
                data: statType
            });
        }

        function updateStatisticType(statType) {
            return apiService.request({
                method: "POST",
                url: `/statisticType/${statType.id}`,
                data: statType
            });
        }

        function updateStatisticTypes(statTypes) {
            return apiService.request({
                method: "POST",
                url: `/statisticTypes`,
                data: statTypes
            });
        }

        function deleteStatisticType(statType) {
            return apiService.request({
                method: "DELETE",
                url: `/statisticType/${statType.id}`
            });
        }

        function addRules(data) {
            return apiService.request({
                method: "POST",
                url: "/rules",
                data: data
            });
        }

        function getRules(filter) {
            return apiService.request({
                method: "GET",
                url: "/rules",
                params: filter
            });
        }

        function deleteRules(data) {
            return apiService.request({
                method: "DELETE",
                url: "/rules",
                data: data
            });
        }
    }
})();