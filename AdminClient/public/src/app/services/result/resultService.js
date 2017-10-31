/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .factory("resultService", resultService);

    resultService.$inject = ['apiService'];

    function resultService(apiService) {
        return {
            updateEventResult: updateEventResult,
            getEventResult: getEventResult,
            updateEventSelectionResult: updateEventSelectionResult,
            getEventSelectionResult: getEventSelectionResult
        };

        function updateEventResult(data) {
            return apiService.request({
                method: "POST",
                url: `/results/events/${data.id}`,
                data: data
            });
        }

        function getEventResult(params) {
            return apiService.request({
                method: "GET",
                url: `/results/events`,
                params: params
            });
        }

        function updateEventSelectionResult(data) {
            return apiService.request({
                method: "POST",
                url: `/results/selections`,
                data: data
            });
        }

        function getEventSelectionResult(params) {
            return apiService.request({
                method: "GET",
                url: `/results/selections`,
                params: params
            });
        }
    }
})();