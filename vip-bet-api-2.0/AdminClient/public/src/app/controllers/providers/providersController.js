(function () {
    angular
        .module("app")
        .controller("providersController", providersController)

    providersController.inject = ['$scope', '$modal', '$translate', '$interval', 'providers', 'commonService', 'mediaService', 'toastr', 'providerStatus'];

    function providersController($scope, $modal, $translate, $interval, providers, commonService, mediaService, toastr, providerStatus) {
        function updateProviders(providers) {
            providers.map(provider => {
                var existingProvider = $scope.providers.find(function (p) { return p.id == provider.id });
                if (!existingProvider) {
                    $scope.providers.push(provider);
                    existingProvider = provider;
                }
                existingProvider.status_id = provider.status_id;

                var dateNow = new Date();
                if (provider.ping_date) {
                    var providerDate = new Date(provider.ping_date);
                    providerDate.setSeconds(providerDate.getSeconds() + 15);
                    if (dateNow > providerDate) existingProvider.status_id = providerStatus.DOWN;
                } else {
                    provider.status_id = providerStatus.DOWN;
                }
            });
        }

        $scope.loading = false;
        $scope.providers = [];
        updateProviders(providers.data);
        $scope.providerStatus = providerStatus;

        $scope.selectProvider = function (provider) {
            if ($scope.selectedProvider && $scope.selectedProvider != provider) $scope.selectedProvider.selected = false;
            $scope.selectedProvider = provider;
            $scope.selectedProvider.selected = true;
        }

        $scope.openProvider = function (provider) {
            commonService.getProvider(provider.id).then(function (settings) {
                provider.settings = settings.data;
            })
        }

        $scope.restartProvider = function (provider) {
            commonService.restartProvider(provider.id).then(function (ok) {
                toastr.success($translate.instant('toastr.provider.restarted'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });;
        }

        $scope.stopProvider = function (provider) {
            commonService.stopProvider(provider.id).then(function (ok) {
                toastr.success($translate.instant('toastr.provider.stopped'), $translate.instant('toastr.success'));
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            });
        }

        $scope.updateProvider = function (provider) {
            mediaService.uploadImage(provider.icon).then(function (fileName) {
                if (fileName) {
                    provider.icon_url = fileName.file;
                    provider.icon_small_url = fileName.file_small;
                }
                commonService.updateProvider(provider).then(function (ok) {
                    toastr.success($translate.instant('toastr.provider.updated'), $translate.instant('toastr.success'));
                }, function (error) {
                    toastr.error(error.data, $translate.instant('toastr.error'));
                });
            });
        }

        $scope.onImageChange = function (files, provider) {
            if (files[0] == undefined) return;
            $scope.fileExt = files[0].name.split(".").pop();
            if ($scope.fileExt.toLocaleLowerCase().match(/^(jpg|jpeg|gif|png|svg)$/)) {
                provider.isImage = true;
            }
            else {
                provider.isImage = false;
            }
        }

        function getProvidersSettings() {
            commonService.getProviders().then(function (data) {
                updateProviders(data.data);
            })
        }

        var interval = $interval(getProvidersSettings, 5000);

        $scope.stopGetProvidersSettings = function () {
            if (angular.isDefined(interval)) {
                $interval.cancel(interval);
                interval = undefined;
            }
        };

        $scope.$on('$destroy', function () {
            // Make sure that the interval is destroyed too
            $scope.stopGetProvidersSettings();
        });

        $scope.sortableOptions = {
            start: function () {
                $scope.sortingUpdated = false;
            },
            update: function (e, ui) {
                $scope.sortingUpdated = true;
            },
            stop: function (e, ui) {
                if ($scope.sortingUpdated) {
                    var orders = $scope.providers.map(function (provider, index) {
                        provider.order_id = index;
                        return provider;
                    });
                    commonService.updateProvidersOrder(orders).then(function (ok) {
                        toastr.success($translate.instant('toastr.providersOrderUpdated'), $translate.instant('toastr.success'));
                    }, function (error) {
                        toastr.error(error.data, $translate.instant('toastr.error'));
                    });
                }
            }
        }
    }
})();