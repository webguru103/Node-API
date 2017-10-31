/**
 * Created by   on 3/27/2017.
 */
(function () {
    angular
        .module('app')
        .factory('warningService', warningService);

    warningService.$inject = ['apiService', '$q', 'warningType'];

    function warningService(apiService, $q, warningType) {
        var warnings = {
            count: 0
        };
        warnings[warningType.category] = [];
        warnings[warningType.participant] = [];
        warnings[warningType.market] = [];
        warnings[warningType.selection] = [];

        var warningsCounts = {};
        warningsCounts[warningType.category] = 0;
        warningsCounts[warningType.participant] = 0;
        warningsCounts[warningType.market] = 0;
        warningsCounts[warningType.selection] = 0;

        return {
            countByType: countByType,
            getWarningsByType: getWarningsByType,
            getWarningsCount: getWarningsCount,
            warnings: warnings,
            warningsCounts: warningsCounts
        };

        function getWarningsCount() {
            var url = "/warning/getWarningsCount";
            return apiService.request({
                method: "GET",
                url: url
            }).then(function (data) {
                warnings.count = data.data.total_count;
            });
        }

        function getWarningsByType(type, page, limit) {
            if (page == null) page = 0;
            if (limit == null) limit = 100;
            warnings[type].length = 0;
            var url = "";
            switch (type) {
                case warningType.category:
                    url = "/warning/getCategoryWarnings";
                    break;
                case warningType.participant:
                    url = "/warning/getParticipantWarnings";
                    break;
                case warningType.market:
                    url = "/warning/getMarketWarnings";
                    break;
                case warningType.selection:
                    url = "/warning/getSelectionWarnings";
                    break;
            }
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    page: page,
                    limit: limit
                }
            }).then(function (data) {
                warnings[type].push.apply(warnings[type], data.data);
                if (data.data.length > 0) warningsCounts[type] = data.data[0].full_count;
                else warningsCounts[type] = 0;
                return $q.resolve(data.data);
            });
        }

        function countByType(warningType) {
            if (warningsCounts[warningType]) return warningsCounts[warningType];
            return 0;
        }
    }
})();