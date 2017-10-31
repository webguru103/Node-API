/**
 * Created by   on 3/10/2017.
 */
(function () {
    angular
        .module("app")
        .factory("commonService", commonService);

    commonService.$inject = ['apiService'];

    function commonService(apiService) {
        return {
            getProviders: getProviders,
            updateProvider: updateProvider,
            restartProvider: restartProvider,
            stopProvider: stopProvider,
            updateProvidersOrder: updateProvidersOrder
        };

        function updateProvidersOrder(orders) {
            return apiService.request({
                method: "POST",
                url: "/common/providersOrder",
                data: orders
            })
        }

        function getProviders() {
            return apiService.request({
                method: "GET",
                url: "/common/providers"
            })
        }

        function updateProvider(provider) {
            return apiService.request({
                method: "POST",
                url: "/common/providers/" + provider.id,
                data: provider
            })
        }
        function restartProvider(id) {
            return apiService.request({
                method: "POST",
                url: "/common/providers/" + id + "/restart"
            })
        }

        function stopProvider(id) {
            return apiService.request({
                method: "POST",
                url: "/common/providers/" + id + "/stop"
            })
        }
    }
})();