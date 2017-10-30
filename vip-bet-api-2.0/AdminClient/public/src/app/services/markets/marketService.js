/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .factory("marketService", marketService);

    marketService.$inject = ['$location', 'apiService'];

    function marketService($location, apiService) {
        return {
            add: add,
            update: update,
            remove: remove,
            getById: getById,
            list: list,
            getMarketMappingsByProviderId: getMarketMappingsByProviderId,
            getUnmappedMarketsByProviderIdAndSportId: getUnmappedMarketsByProviderIdAndSportId,
            mapMarketWithSelections: mapMarketWithSelections,
            getSelectionsMappingsByProviderIdAndMarketId: getSelectionsMappingsByProviderIdAndMarketId,
            updateMany: updateMany
        };

        function getSelectionsMappingsByProviderIdAndMarketId(providerId, providerMarketId, systemCategoryId) {
            return apiService.request({
                method: "GET",
                url: "/mapping/selection/getByProviderIdAndMarketId",
                params: {
                    providerId: providerId,
                    providerMarketId: providerMarketId,
                    systemCategoryId: systemCategoryId
                }
            });
        }

        function mapMarketWithSelections(providerId, systemMarketId, marketMappings, selectionMappings) {
            var url = "/mapping/market/mapWithSelections";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    providerId: providerId,
                    systemMarketId: systemMarketId,
                    marketMappings: marketMappings,
                    selectionMappings: selectionMappings
                }
            });
        }

        function getMarketMappingsByProviderId(systemMarketId, providerId) {
            var url = "/mapping/market/getByProviderId";
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    systemMarketId: systemMarketId,
                    providerId: providerId
                }
            });
        }

        function getUnmappedMarketsByProviderIdAndSportId(sportId, providerId) {
            var url = "/mapping/market/getUnmappedByProviderIdAndSportId";
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    sportId: sportId,
                    providerId: providerId
                }
            });
        }

        function list(sportId, name, langId, statusId, includeSelections) {
            var url = "/markets";
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    category_id: sportId,
                    name: name,
                    lang_id: langId,
                    status_id: statusId,
                    include_selections: includeSelections
                }
            });
        }

        function getById(id, langId, include_selections) {
            var url = `/market/${id}`;
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    lang_id: langId,
                    include_selections: include_selections || true
                }
            });
        }

        function add(market) {
            var url = "/market";
            return apiService.request({
                method: "POST",
                url: url,
                data: market
            });
        }

        function update(market) {
            var url = `/market/${market.id}`;
            return apiService.request({
                method: "POST",
                url: url,
                data: market
            });
        }

        function remove(id) {
            var url = `/market/${id}`;
            return apiService.request({
                method: "DELETE",
                url: url
            });
        }

        function updateMany(markets) {
            var url = "/markets";
            return apiService.request({
                method: "POST",
                url: url,
                data: markets
            });
        }
    }
})();