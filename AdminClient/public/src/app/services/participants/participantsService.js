/**
 * Created by   on 3/17/2017.
 */
(function () {
    angular
        .module("app")
        .factory("participantsService", participantsService);

    participantsService.$inject = ['apiService'];

    function participantsService(apiService) {
        return {
            list: list,
            addParticipant: addParticipant,
            deleteParticipant: deleteParticipant,
            mapParticipant: mapParticipant,
            updateMapping: updateMapping,
            listMappings: listMappings,
            updateParticipant: updateParticipant,
            updateParticipantLeagues: updateParticipantLeagues,
            getParticipantLeagues: getParticipantLeagues,
            getProviderParticipants: getProviderParticipants,
            unmapByMapId: unmapByMapId,
            updateParticipantMappings: updateParticipantMappings
        };

        function unmapByMapId(map_id) {
            var url = `/mapping/participant/${map_id}`;
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    system_participant_id: null
                }
            })
        }

        function getProviderParticipants(providerId, sportId, unmapped, name, page, limit) {
            var url = `/provider/${providerId}/participants`;
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    provider_id: providerId,
                    sport_id: sportId,
                    unmapped: unmapped,
                    name: name,
                    limit: limit,
                    page: page
                }
            })
        }

        function getParticipantLeagues(id, langId) {
            var url = `/participants/${id}/leagues`;
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    lang_id: langId
                }
            })
        }

        function updateParticipantLeagues(id, leagues) {
            var url = `/participants/${id}/leagues`;
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    id: id,
                    leagues: leagues
                }
            })
        }

        function updateParticipant(id, name, lang_id, icon_url, icon_small_url) {
            var url = "/participants/updateParticipant";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    id: id,
                    name: name,
                    lang_id: lang_id,
                    icon_url: icon_url,
                    icon_small_url: icon_small_url
                }
            })
        }

        function listMappings(providerId, systemParticipantId) {
            var url = `/participants/${systemParticipantId}/mappings`;
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    provider_id: providerId
                }
            });
        }

        function addParticipant(name, lang_id, sport_id, icon_url, icon_small_url) {
            var url = "/participants/addParticipant";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    name: name,
                    sport_id: sport_id,
                    lang_id: lang_id,
                    icon_url: icon_url,
                    icon_small_url: icon_small_url,
                    test: null
                }
            })
        }

        function deleteParticipant(id) {
            var url = "/participants/deleteParticipant";
            return apiService.request({
                method: 'POST',
                url: url,
                data: {
                    id: id
                }
            })
        }

        function mapParticipant(systemParticipantId, maps) {
            var url = `/participants/${systemParticipantId}/mappings`;
            return apiService.request({
                method: 'POST',
                url: url,
                data: {
                    maps: maps
                }
            })
        }

        function updateMapping(systemParticipantId, mapId, providerId) {
            var url = `/mapping/participant/${mapId}`;
            return apiService.request({
                method: 'POST',
                url: url,
                data: {
                    system_participant_id: systemParticipantId,
                    provider_id: providerId
                }
            })
        }

        function updateParticipantMappings() {
            var url = "/participants/updateParticipantMappings";
            return apiService.request({
                method: 'POST',
                url: url
            })
        }

        function list(filter) {
            var url = "/participants";
            return apiService.request({
                method: 'GET',
                url: url,
                params: filter
            })
        }
    }
})();