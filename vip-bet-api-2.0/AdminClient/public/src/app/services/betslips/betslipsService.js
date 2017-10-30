/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .factory("betslipsService", betslipsService);

    betslipsService.$inject = ['apiService'];

    function betslipsService(apiService) {
        var filter = {};

        return {
            filter: filter,
            list: list,
            get: get,
            update: update,
        };

        function list(dateFrom, dateTo, status, awaitingResult, page, limit) {
            return apiService.request({
                method: "GET",
                url: "/betslips",
                params: {
                    place_date_from: dateFrom,
                    place_date_to: dateTo,
                    status_id: status,
                    awaiting_result: awaitingResult,
                    page: page,
                    limit: limit
                }
            });
        }

        function get(id) {
            return apiService.request({
                method: "GET",
                url: `/betslips/${id}`
            });
        }

        function update(data) {
            return apiService.request({
                method: "POST",
                url: `/betslips/${data.id}`,
                data: data
            });
        }
    }
})();