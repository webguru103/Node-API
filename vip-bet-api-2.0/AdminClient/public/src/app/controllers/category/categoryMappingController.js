/**
 * Created by   on 3/10/2017.
 */
(function () {
    angular
        .module("app")
        .controller("categoryMappingController", categoryMappingController);

    categoryMappingController.$inject = ['$scope', '$modalInstance', '$translate',
        'modalMessage', 'selectedCategory', 'categoryService', 'toastr', 'providers'];

    function categoryMappingController($scope, $modalInstance, $translate, modalMessage,
        selectedCategory, categoryService, toastr, providers) {
        $scope.message = modalMessage.message;
        $scope.yes = modalMessage.yes;
        $scope.no = modalMessage.no;

        $scope.providers = providers.data;
        $scope.selectedCategory = selectedCategory;
        $scope.mappings = [];

        $scope.onProviderChange = function () {
            $scope.mappings.length = 0;

            categoryService.getCategoryMappingsByProviderId(selectedCategory.id, $scope.provider.id).then(function (data) {
                $scope.mappings = data.data;

                $scope.mappings.forEach(function (map) {
                    map.providerCategory = {};
                    angular.copy(map, map.providerCategory);
                });

                if ($scope.mappings.length == 0) {
                    $scope.mappings.push({ providerCategory: {} })
                }
            });
            categoryService.getUnmappedCategoriesByProviderIdAndTypeId($scope.provider.id, selectedCategory.original.type_id).then(function (data) {
                $scope.unmappedCategories = data.data;
            });
        };

        $scope.onAddMapping = function () {
            $scope.mappings.push({
                systemCategoryId: selectedCategory.original.id,
                systemCategoryName: selectedCategory.original.name,
                providerCategoryName: "",
                providerCategoryId: null
            })
        };

        $scope.removeMapping = function (map) {
            $scope.mappings.splice($scope.mappings.indexOf(map), 1);
        };

        $scope.ok = function () {
            var mappings = [];
            $scope.mappings.forEach(function (map) {
                mappings.push(map.providerCategory.provider_category_id);
            });

            categoryService.map(selectedCategory.id, $scope.provider.id, mappings, selectedCategory.original.type_id).then(function (ok) {
                toastr.success($translate.instant('toastr.mapping.mappingSaved'), $translate.instant('toastr.success'));
                $modalInstance.close();
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            })
        };

        $scope.cancel = function () {
            $modalInstance.dismiss();
        };
    }
})();