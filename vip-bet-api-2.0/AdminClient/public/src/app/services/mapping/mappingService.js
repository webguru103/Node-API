/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .factory("mappingService", mappingService);

    mappingService.$inject = ['apiService', '$q'];

    function mappingService(apiService, $q) {
        var cateogries = null;
        return {
            updateCategory: updateCategory,
            updateCategories: updateCategories
        }
        function updateCategory(category) {
            var url = "/mapping/updateCategory";
            return apiService.request({
                method: "POST",
                url: url,
                data: category
            });
        }
        function updateCategories(categories) {
            var url = "/mapping/updateCategories";
            return apiService.request({
                method: "POST",
                url: url,
                data: categories
            });
        }
    }
})();