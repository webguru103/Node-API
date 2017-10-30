/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .controller("categoryController", categoryController);

    categoryController.$inject = ['$rootScope', '$scope', '$modal', '$translate', 'categories', 'categoryType', 'commonService', 'categoryService', 'toastr', 'categoryStatus', 'userService'];

    function categoryController($rootScope, $scope, $modal, $translate, categories, categoryType, commonService, categoryService, toastr, categoryStatus, userService) {
        $scope.categoryType = categoryType;
        $scope.categories = categories.data;
        $scope.parentName = "sport";
        $scope.childName = "";
        $scope.permissions = userService.permissions;

        $scope.onSelectNode = function (node) {
            $scope.categorySelected = true;
            $scope.selectedCategory = node;

            if ($scope.selectedCategory) {
                $scope.parentName = categoryType[$scope.selectedCategory.original.type_id];
                $scope.childName = categoryType[$scope.selectedCategory.original.type_id + 1];
            }
        };

        $scope.onDeleteCategory = function () {
            $modal.open({
                templateUrl: 'src/app/views/category/deleteCategoryModal.html',
                controller: 'deleteCategoryController',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.category.deleteCategory'),
                            yes: $translate.instant('delete'),
                            no: $translate.instant('cancel')
                        }
                    },
                    category: function () {
                        return $scope.selectedCategory;
                    },
                    categories: function () {
                        return $scope.categories;
                    }
                }
            })
        };

        $scope.onAddCategory = function (isSameLevel) {
            $modal.open({
                templateUrl: 'src/app/views/category/addCategory.html',
                controller: 'addCategoryController',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.category.addCategory'),
                            yes: $translate.instant('add'),
                            no: $translate.instant('cancel')
                        }
                    },
                    parentCategory: function () {
                        return $scope.selectedCategory;
                    },
                    categories: function () {
                        return $scope.categories;
                    },
                    isSameLevel: function () {
                        return isSameLevel;
                    }
                }
            })
        };

        $scope.onMapCategory = function () {
            $modal.open({
                templateUrl: 'src/app/views/category/categoryMapping.html',
                controller: 'categoryMappingController',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.category.categoryMapping'),
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    },
                    selectedCategory: function () {
                        return $scope.selectedCategory;
                    },
                    providers: function () {
                        return commonService.getProviders();
                    }
                }
            })
        };

        $scope.onEditCategory = function () {
            $modal.open({
                templateUrl: 'src/app/views/category/editCategory.html',
                controller: 'editCategoryController',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.category.edit'),
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    },
                    selectedCategory: function () {
                        return $scope.selectedCategory;
                    },
                    providers: function () {
                        return commonService.getProviders();
                    }
                }
            })
        };
        $scope.showCategory = function (show) {
            var copyCategory = Object.assign({}, $scope.selectedCategory.original)
            if (show) {
                copyCategory.status_id = categoryStatus.ACTIVE;
            } else {
                copyCategory.status_id = categoryStatus.HIDE;
            }
            categoryService.updateCategory(copyCategory).then(function (ok) {
                $scope.selectedCategory.original.status_id = copyCategory.status_id;
                if (copyCategory.status_id == categoryStatus.HIDE) $scope.selectedCategory.li_attr["class"] = "node-inactive";
                if (copyCategory.status_id == categoryStatus.ACTIVE) $scope.selectedCategory.li_attr["class"] = "node-active";
                $scope.selectedCategory.instance.jstree(true).redraw_node($scope.selectedCategory);

                toastr.success($translate.instant('toastr.category.updated'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            })
        };
    }
})();