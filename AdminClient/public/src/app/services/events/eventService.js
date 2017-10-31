/**
 * Created by   on 3/11/2017.
 */
(function () {
    angular
        .module("app")
        .factory("eventService", eventService);

    eventService.$inject = ['apiService', 'eventStatus'];

    function eventService(apiService, eventStatus) {
        var filter = {};
        filter[eventStatus.ACTIVE] = {
            sport: { name: "all" },
            country: { name: "all" },
            league: { name: "all" }
        };
        filter[eventStatus.CLOSED] = {
            sport: { name: "all" },
            country: { name: "all" },
            league: { name: "all" }
        };
        var events = {}
        events[eventStatus.ACTIVE] = [];
        events[eventStatus.CLOSED] = [];

        return {
            events: events,
            filter: filter,
            list: list,
            get: get
        };

        function list(sportId, countryId, leagueId, dateFrom, dateTo, eventName, langId, status, page, limit) {
            return apiService.request({
                method: "GET",
                url: "/events",
                params: {
                    sport_id: sportId,
                    country_id: countryId,
                    league_id: leagueId,
                    lang_id: langId,
                    date_from: dateFrom,
                    date_to: dateTo,
                    name: eventName,
                    status: status,
                    page: page,
                    limit: limit
                }
            });
        }

        function get(eventId, langId) {
            return apiService.request({
                method: "GET",
                url: "/events/getEvent/",
                params: {
                    id: eventId,
                    lang_id: langId
                }
            });
        }
    }
})();