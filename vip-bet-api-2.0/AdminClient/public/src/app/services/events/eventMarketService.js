/**
 * Created by   on 3/25/2017.
 */
(function () {
    angular
        .module("app")
        .factory("eventMarketService", eventMarketService);

    eventMarketService.$inject = ['apiService'];

    function eventMarketService(apiService) {
        return {
            getEventMarkets: getEventMarkets,
            getProviderOdds: getProviderOdds,
            getEventProviderOdds: getEventProviderOdds
        };

        function getEventMarkets(eventId, langId) {
            return apiService.request({
                method: "GET",
                url: "/eventMarket/getEventMarkets",
                params: {
                    lang_id: langId,
                    event_id: eventId
                }
            });
        }

        function getProviderOdds(providerId, eventId) {
            return apiService.request({
                method: "GET",
                url: "/eventMarket/getProviderOdds",
                params: {
                    provider_id: providerId,
                    event_id: eventId
                }
            });
        }

        function getEventProviderOdds(eventId) {
            return apiService.request({
                method: "GET",
                url: "/eventMarket/getEventProviderOdds",
                params: {
                    event_id: eventId
                }
            });
        }
    }
})();