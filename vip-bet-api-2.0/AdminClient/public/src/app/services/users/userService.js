(function () {
    angular
        .module("app")
        .factory("userService", userService);

    userService.$inject = ['apiService', '$q', '$location', '$cookies'];

    function userService(apiService, $q, $location, $cookies) {
        var failedURL
        var admins = [];
        var users = [];
        var adminsFilter = {};
        adminsFilter.user_roles = ['admin'];
        var usersFilter = {};
        usersFilter.user_roles = ['user'];
        var permissions = [];
        return {
            login: login,
            logout: logout,
            setFailedURL: setFailedURL,
            admins: admins,
            adminsFilter: adminsFilter,
            users: users,
            usersFilter: usersFilter,
            find: find,
            allPermissions: allPermissions,
            update: update,
            addAdmin: addAdmin,
            getPermissions: getPermissions,
            permissions: permissions
        }

        function getPermissions() {
            if (permissions.length > 0) return permissions;
            return apiService.request({
                method: "GET",
                url: "/admins/permissions"
            }).then(function (data) {
                permissions.push.apply(permissions, data.data.data);
                return permissions;
            })
        }

        function addAdmin(data) {
            return apiService.request({
                method: "POST",
                url: "/admins",
                data: data
            })
        }

        function update(data) {
            return apiService.request({
                method: "POST",
                url: "/users/" + data.id,
                data: data
            })
        }

        function allPermissions() {
            return apiService.request({
                method: "GET",
                url: "/permissions"
            })
        }

        function find(params) {
            return apiService.request({
                method: "GET",
                url: "/users",
                params: params
            })
        }

        function login(email, password) {
            return apiService.request({
                method: "POST",
                url: "/login",
                data: {
                    email: email,
                    password: password
                }
            }).then(function (res) {
                if (res.status == 200) {
                    $cookies.put('token', res.data.data.access_token);
                    return getPermissions().then(function (permissions) {
                        // redirect to failed url
                        if (failedURL) $location.path(failedURL);
                        else $location.path("/");
                        failedURL = undefined;
                    })
                }
            });
        }

        function logout() {
            return apiService.request({
                method: "POST",
                url: "/logout"
            }).then(function (res) {
                if (res.status == 200) {
                    $cookies.remove('token');
                    setFailedURL();
                    $location.path("/login");
                    permissions.length = 0;
                }
            });
        }

        function setFailedURL() {
            var url = $location.path();
            if (url === "/login") return;
            failedURL = url;
        }
    }
})();