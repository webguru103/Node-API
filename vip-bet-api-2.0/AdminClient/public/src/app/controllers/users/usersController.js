(function () {
    angular
        .module("app")
        .controller("usersController", usersController)

    usersController.inject = ['$scope', '$modal', '$translate', '$interval', '$location', '$timeout', '$state', 'mediaService', 'toastr', 'userService', 'userStatus'];

    function usersController($scope, $modal, $translate, $interval, $location, $timeout, $state, mediaService, toastr, userService, userStatus) {
        $scope.userStatus = userStatus;
        // set filter settings
        var path = $location.path();
        if (path.indexOf("/app/admins") !== -1) {
            $scope.filter = userService.adminsFilter;
            $scope.users = userService.admins;
        } else if (path.indexOf("/app/users") !== -1) {
            $scope.filter = userService.usersFilter;
            $scope.users = userService.users;
        }

        if ($scope.filter) {
            $scope.filter.maxPages = 10000;
            $scope.filter.limit = 75;
            if (!$scope.filter.page) $scope.filter.page = 1;
            if (!$scope.filter.status_id) $scope.filter.status_id = "";
        }
        $scope.search = function () {
            $scope.filter.page = 1;
            $scope.onPageChange();
        };

        $scope.datePicker = {};
        $scope.datePicker.date = { startDate: null, endDate: null };
        // get users
        $scope.onPageChange = function () {
            // show loading spinner
            $scope.loading = true;
            // clean array
            $scope.users.length = 0;
            // set date from/to
            if ($scope.datePicker.date.startDate) $scope.filter.date_from = moment.utc($scope.datePicker.date.startDate.startOf('day')).format("YYYY-MM-DD HH:mm:ss");
            if ($scope.datePicker.date.endDate) $scope.filter.date_to = moment.utc($scope.datePicker.date.endDate.endOf('day')).format("YYYY-MM-DD HH:mm:ss");
            // get users
            userService.find($scope.filter)
                .then(function (data) {
                    data = data.data
                    $scope.users.push.apply($scope.users, data.data);
                    if ($scope.users[0]) $scope.filter.totalItems = $scope.users[0].full_count;
                    $scope.loading = false;
                }, function (error) {
                    $scope.loading = false;
                    toastr.error(error.data, $translate.instant('toast.error'))
                });
        };

        if ($scope.users !== undefined && $scope.users.length === 0) {
            $scope.loading = true;
            $timeout($scope.search, 400);
        }

        $scope.openUser = function (user) {
            var path = $location.path();
            if (path.indexOf("/app/admins") !== -1) {
                $state.go('app.admins.admin', { id: user.id });
            } else if (path.indexOf("/app/users") !== -1) {
                $state.go('app.users.user', { id: user.id });
            }
        }

        $scope.blockUser = function (user) {
            $scope.updateUser({
                id: user.id,
                status_id: userStatus.BLOCKED
            });
        }

        $scope.unblockUser = function (user) {
            $scope.updateUser({
                id: user.id,
                status_id: userStatus.ACTIVE
            });
        }

        $scope.updateUser = function (user) {
            userService.update(user).then(function (data) {
                toastr.success($translate.instant('toastr.updated'), $translate.instant('toastr.success'));
                $scope.user = data.data.data;
            }, function (error) {
                toastr.error(error.data, $translate.instant('toastr.error'));
            })
        }

        $scope.addAdmin = function () {
            $modal.open({
                templateUrl: 'src/app/views/admins/adminAdd.html',
                size: 'md',
                controller: "adminAddController",
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.admins.add'),
                            yes: $translate.instant('add'),
                            no: $translate.instant('cancel')
                        }
                    },
                    permissions: function () {
                        return userService.allPermissions().then(function (data) {
                            return data.data.data;
                        })
                    }
                }
            })
        }
    }
})();