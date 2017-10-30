/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .factory("categoryService", categoryService);

    categoryService.$inject = ['apiService', '$q'];

    function categoryService(apiService, $q) {
        var categories = null;
        return {
            deleteCategory: deleteCategory,
            addCategory: addCategory,
            getCategoryMappingsByProviderId: getCategoryMappingsByProviderId,
            getUnmappedCategoriesByProviderIdAndTypeId: getUnmappedCategoriesByProviderIdAndTypeId,
            map: map,
            appendMap: appendMap,
            unmap: unmap,
            unmapProviderCategory: unmapProviderCategory,
            getCategories: getCategories,
            getAllCategories: getAllCategories,
            updateCategory: updateCategory,
            updateCategoryOrder: updateCategoryOrder,
            getProviderLeaguesBySportId: getProviderLeaguesBySportId,
            updateProviderCategory: updateProviderCategory
        }
        function updateProviderCategory(category) {
            var url = "/category/updateProviderCategory";
            return apiService.request({
                method: "POST",
                url: url,
                data: category
            });
        }
        function getCategories(filter) {
            if (filter.parent_id === undefined) filter.parent_id = "";
            if (filter.status_id === undefined) filter.status_id = "";
            var url = "/category";
            return apiService.request({
                method: "GET",
                url: url,
                params: filter
            });
        }
        function getProviderLeaguesBySportId(provider_id, sport_id, mapped, status, page, limit) {
            var url = "/category/getProviderLeaguesBySportId";
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    provider_id: provider_id,
                    sport_id: sport_id,
                    mapped: mapped,
                    status: status,
                    page: page,
                    limit: limit
                }
            });
        }
        function updateCategoryOrder(id, type_id, parent_category_id, step, direction) {
            var url = "/category/updateCategoryOrder";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    id: id,
                    type_id: type_id,
                    step: step,
                    direction: direction,
                    parent_category_id: parent_category_id
                }
            });
        }

        function updateCategory(category) {
            var url = "/category/update";
            return apiService.request({
                method: "POST",
                url: "/category/update",
                data: {
                    id: category.id,
                    name: category.name,
                    lang_id: category.lang_id,
                    dict_id: category.dict_id,
                    status_id: category.status_id,
                    icon_url: category.icon_url,
                    icon_small_url: category.icon_small_url,
                }
            });
        }

        function getAllCategories(lang_id) {
            var url = "/category";
            var defer = $q.defer();
            if (categories) {
                defer.resolve(categories);
            } else {
                apiService.request({
                    method: "GET",
                    url: url,
                    params: {
                        lang_id: lang_id,
                        status_id: ""
                    }
                }).then(function (data) {
                    categories = {};
                    data.data.forEach(function (category) {
                        categories[category.id] = category.name;
                    });
                    defer.resolve(categories);
                });
            }
            return defer.promise;
        }

        function map(system_category_id, provider_id, provider_objects_id, category_type) {
            var url = "/category/map";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    system_category_id: system_category_id,
                    provider_id: provider_id,
                    provider_objects_id: provider_objects_id,
                    category_type: category_type
                }
            });
        }

        function appendMap(system_category_id, provider_id, provider_objects_id, category_type) {
            var url = "/category/appendMap";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    system_category_id: system_category_id,
                    provider_id: provider_id,
                    provider_objects_id: provider_objects_id,
                    category_type: category_type
                }
            });
        }

        function unmap(system_category_id, provider_id) {
            var url = "/category/unmap";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    system_category_id: system_category_id,
                    provider_id: provider_id
                }
            });
        }

        function unmapProviderCategory(provider_category_id, category_type, provider_id) {
            var url = "/category/unmapProviderCategory";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    provider_category_id: provider_category_id,
                    category_type: category_type,
                    provider_id: provider_id
                }
            });
        }

        function getCategoryMappingsByProviderId(system_category_id, provider_id) {
            if (system_category_id == null || system_category_id == "#") return $q.resolve({ data: [] });
            var url = "/category/getCategoryMappingsByProviderId";
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    system_category_id: system_category_id,
                    provider_id: provider_id
                }
            })
        }

        function getUnmappedCategoriesByProviderIdAndTypeId(provider_id, type_id) {
            var url = "/category/getUnmappedCategoriesByProviderIdAndTypeId";
            return apiService.request({
                method: "GET",
                url: url,
                params: {
                    type_id: type_id,
                    provider_id: provider_id
                }
            })
        }

        function addCategory(name, lang_id, type_id, parent_id, icon_url, icon_small_url) {
            var url = "/category/add";
            return apiService.request({
                method: "POST",
                url: url,
                data: {
                    name: name,
                    lang_id: lang_id,
                    parent_id: parent_id,
                    type_id: type_id,
                    icon_url: icon_url,
                    icon_small_url: icon_small_url
                }
            });
        }

        function deleteCategory(id, moveEventsToLeague) {
            var url = "/category/delete";
            return apiService.request({
                method: "DELETE",
                url: url,
                data: {
                    id: Number(id),
                    move_to_league: moveEventsToLeague
                },
                headers: {
                    "Content-Type": "application/json;charset=utf-8"
                }
            });
        }
    }
})();