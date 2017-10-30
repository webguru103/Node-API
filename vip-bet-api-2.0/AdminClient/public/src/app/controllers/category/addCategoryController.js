/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .controller("addCategoryController", addCategoryController);

    addCategoryController.$inject = ['$scope', '$modalInstance', '$translate', 'modalMessage', 'parentCategory', 'categories', 'categoryService', 'toastr', 'categoryType', 'isSameLevel', 'mediaService', 'userService'];

    function addCategoryController($scope, $modalInstance, $translate, modalMessage, parentCategory, categories, categoryService, toastr, categoryType, isSameLevel, mediaService, userService) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;
        $scope.categoryType = categoryType;
        $scope.icon = {};

        var permissions = userService.permissions;

        $scope.showIcon = function () {
            var selectedCategoryType = parentCategory == null ? categoryType.sport : parentCategory.original.type_id + 1;
            if (isSameLevel) {
                selectedCategoryType = parentCategory == null ? categoryType.sport : parentCategory.original.type_id;
            }
            if (selectedCategoryType == categoryType.sport && (permissions.includes('sport_icon') || permissions.includes('super_admin'))) return true;
            if (selectedCategoryType == categoryType.country && (permissions.includes('category_icon') || permissions.includes('super_admin'))) return true;
            if (selectedCategoryType == categoryType.league && (permissions.includes('league_icon') || permissions.includes('super_admin'))) return true;
            return false;
        }

        $scope.ok = function () {
            var selectedCategoryType = parentCategory == null ? categoryType.sport : parentCategory.original.type_id + 1;
            if (isSameLevel) {
                selectedCategoryType = parentCategory == null ? categoryType.sport : parentCategory.original.type_id;
            }

            var parentId = parentCategory == null ? null : parentCategory.id;
            if (isSameLevel) {
                if (parentCategory == null || parentCategory.parent == '#') {
                    parentId = null
                } else {
                    parentId = parentCategory.parent;
                }
            }

            mediaService.uploadImage($scope.icon.file).then(function (files) {
                var icon_url = files ? files.file : "";
                var icon_small_url = files ? files.file_small : "";
                categoryService.addCategory($scope.name, 1, selectedCategoryType, parentId, icon_url, icon_small_url).then(function (ok) {
                    categories.push({
                        id: ok.data.id,
                        type_id: selectedCategoryType,
                        text: $scope.name,
                        name: $scope.name,
                        icon_url: icon_url,
                        icon_small_url: icon_small_url,
                        icon: icon_small_url,
                        parent: parentId || "#",
                        state: { loaded: false }
                    });

                    toastr.success($translate.instant('toastr.category.categoryAdded'), $translate.instant('toastr.success'));
                    $modalInstance.close();
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                })
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();