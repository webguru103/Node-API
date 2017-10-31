/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .controller("editCategoryController", editCategoryController);

    editCategoryController.$inject = ['$scope', '$modalInstance', '$translate', 'modalMessage', 'selectedCategory',
        'categoryService', 'toastr', 'categoryType', 'mediaService', 'userService'];

    function editCategoryController($scope, $modalInstance, $translate, modalMessage, selectedCategory,
        categoryService, toastr, categoryType, mediaService, userService) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;
        $scope.category = {};
        $scope.icon = {};
        
        var permissions = userService.permissions;

        angular.copy(selectedCategory.original, $scope.category);

        $scope.showIcon = function () {
            var selectedCategoryType = $scope.category.type_id;
            if (selectedCategoryType == categoryType.sport && (permissions.includes('sport_icon') || permissions.includes('super_admin'))) return true;
            if (selectedCategoryType == categoryType.country && (permissions.includes('category_icon') || permissions.includes('super_admin'))) return true;
            if (selectedCategoryType == categoryType.league && (permissions.includes('league_icon') || permissions.includes('super_admin'))) return true;
            return false;
        }

        $scope.ok = function () {
            mediaService.uploadImage($scope.icon.file).then(function (files) {
                if (files) {
                    $scope.category.icon_url = files.file;
                    $scope.category.icon_small_url = files.file_small;
                    $scope.category.icon = files.file_small;
                }

                categoryService.updateCategory($scope.category).then(function (ok) {
                    selectedCategory.original.name = $scope.category.name;
                    selectedCategory.original.text = $scope.category.name;
                    selectedCategory.text = $scope.category.name;
                    selectedCategory.original.status_id = $scope.category.status_id;

                    if (files) {
                        selectedCategory.original.icon_url = files.file;
                        selectedCategory.original.icon_small_url = files.file_small;
                        selectedCategory.original.icon = files.file_small;
                    }

                    toastr.success($translate.instant('toastr.category.updated'), $translate.instant('toastr.success'));
                    $modalInstance.close();
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                })
            })
        }

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };

        $scope.onImageChange = function (files, category) {
            if (files[0] == undefined) return;
            $scope.fileExt = files[0].name.split(".").pop();
            if ($scope.fileExt.toLocaleLowerCase().match(/^(jpg|jpeg|gif|png|svg)$/)) {
                category.isImage = true;
            }
            else {
                category.isImage = false;
            }
        }
    }
})();