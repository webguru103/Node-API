(function () {
    angular
        .module("app")
        .controller("leagueMappingController", leagueMappingController);

    leagueMappingController.$inject = ['$rootScope', '$scope', '$translate', 'providers', 'sports', 'categoryService', 'toastr',
        'categoryType', 'categoryStatus', 'mappingService'];

    function leagueMappingController($rootScope, $scope, $translate, providers, sports, categoryService, toastr,
        categoryType, categoryStatus, mappingService) {

        $scope.categoryStatus = categoryStatus;
        $scope.providers = providers.data;
        $scope.sports = sports.data;
        $scope.filter = { maxPages: 10000, perPage: 150, status: categoryStatus.ACTIVE, mapped: "true" };
        $scope.leagues = [];
        $scope.sportLeagues = {};

        $scope.onPageChange = function () {
            $scope.loading = true;
            var sportId = $scope.filter.sport.id;
            categoryService.getProviderLeaguesBySportId($scope.filter.provider.id, sportId, $scope.filter.mapped, $scope.filter.status, $scope.filter.currentPage, $scope.filter.perPage).then(function (data) {
                var result = data;
                $scope.leagues = result.data;
                $scope.leagues.forEach(function (league) {
                    if (league.system_category_id) {
                        league.systemLeague = $scope.sportLeagues[sportId].find(function (e) {
                            return e.id == league.system_category_id;
                        })
                    }
                })
                $scope.loading = false;
                if ($scope.leagues[0]) $scope.filter.totalItems = $scope.leagues[0].full_count;
            })
        }

        $scope.findLeagues = function () {
            $scope.filter.currentPage = 1;
            if (!$scope.sportLeagues[$scope.filter.sport.id]) {
                categoryService.getCategories({ sport_id: $scope.filter.sport.id, lang_id: $rootScope.langId, type_id: categoryType.league }).then(function (data) {
                    $scope.sportLeagues[$scope.filter.sport.id] = data.data;
                    $scope.onPageChange();
                })
            } else {
                $scope.onPageChange();
            }
        }

        $scope.searchLeague = function ($select, league, sportId) {
            league.searchResult = [];
            if ($select.search.length == 0) return;
            league.systemLeague = null;
            categoryService.getCategories({
                lang_id: $rootScope.langId,
                name: $select.search,
                type_id: categoryType.league,
                sport_id: sportId,
                include_parent_names: true
            }).then(function (data) {
                league.searchResult = data.data.map(function (res) {
                    res.name = res.parent_name + "/" + res.name;
                    delete res.parent_name;                    
                    return res;
                })
            })
        }

        $scope.map = function (league) {
            categoryService.appendMap(league.systemLeague.id, $scope.filter.provider.id, [].concat(league.provider_category_id), categoryType.league).then(function (ok) {
                toastr.success($translate.instant('toastr.mapping.mappingSaved'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            })
        }

        $scope.unmap = function (league) {
            categoryService.unmapProviderCategory(league.provider_category_id, categoryType.league, $scope.filter.provider.id).then(function (ok) {
                league.systemLeague = null;
                toastr.success($translate.instant('toastr.mapping.mappingSaved'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }

        $scope.showHideProviderLeague = function (league) {
            var status = league.provider_category_status_id == categoryStatus.ACTIVE ? categoryStatus.HIDE : categoryStatus.ACTIVE;
            mappingService.updateCategory(Object.assign(league, { provider_category_status_id: status })).then(function (ok) {
                league.provider_category_status_id = status;
                toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }

        // get all categories status
        $scope.allCategoriesStatus = function () {
            if ($scope.leagues.find(function (c) { return c.provider_category_status_id == categoryStatus.HIDE })) return categoryStatus.HIDE;
            return categoryStatus.ACTIVE;
        }

        $scope.showHideProviderAllLeagues = function () {
            var status = $scope.allCategoriesStatus() == categoryStatus.ACTIVE ? categoryStatus.HIDE : categoryStatus.ACTIVE;
            var categories = $scope.leagues.map(function (c) {
                var category = Object.assign({}, c);
                category.provider_category_status_id = status;
                return category;
            })
            mappingService.updateCategories(categories).then(function (ok) {
                $scope.leagues.forEach(function (c) { c.provider_category_status_id = status });
                toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }
    }
})();