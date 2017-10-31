(function () {
    angular
        .module("app")
        .factory("betslipDetailService", betslipDetailService);

    betslipDetailService.$inject = ['apiService'];

    function betslipDetailService(apiService) {
        var filter = {};

        return {
            filter: filter,
            update: update,
        };

        function update(data) {
            return apiService.request({
                method: "POST",
                url: `/betslipDetails/${data.id}`,
                data: {
                    status_id: data.status_id
                }
            });
        }
    }
})();
