/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .controller("deleteCategoryController", deleteCategoryController);

    deleteCategoryController.$inject = ['$rootScope', '$scope', '$modalInstance', '$translate', 'modalMessage', 'category', 'categories', 'categoryService', 'toastr', 'categoryType'];

    function deleteCategoryController($rootScope, $scope, $modalInstance, $translate, modalMessage, category, categories, categoryService, toastr, categoryType) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;
        $scope.selectedCategory = category;
        $scope.categoryType = categoryType;
        $scope.moveToLeague = false;
        $scope.ok = function () {
            categoryService.deleteCategory(category.id, category.moveToLeague ? category.moveToLeague.id : null).then(function (ok) {
                for (var i in categories) {
                    if (categories[i].id == category.id) {
                        categories.splice(i, 1)
                        break;
                    }
                }
                category = null;
                toastr.success($translate.instant('toastr.category.categoryDeleted'), $translate.instant('toastr.success'));
                $modalInstance.close();
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.searchLeague = function ($select, league) {
            $scope.searchResult = [];
            if ($select.search.length == 0) return;
            $scope.moveLeague = null;
            categoryService.getCategories({
                lang_id: $rootScope.langId,
                name: $select.search,
                type_id: categoryType.league,
                sport_id: category.parents.length == 1 ? null : category.parents[category.parents.length - 2],
                include_parent_names: true
            }).then(function (data) {
                $scope.searchResult = data.data;
                $scope.searchResult.forEach(function (res) {
                    res.name = res.parent_name + "/" + res.name;
                })
            })
        };

        $scope.invalidForm = function () {
            if (category && category.original.type_id != categoryType.league) return false;
            if ($scope.moveToLeague && !category.moveToLeague) return true;
            if ($scope.moveToLeague && category.moveToLeague.id == category.id) return true;
            return false;
        };
    }
})();