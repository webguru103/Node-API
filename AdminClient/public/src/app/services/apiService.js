(function () {
    angular
        .module("app")
        .factory("apiService", apiService);

    apiService.$inject = ['$http', '$q', '$location', '$cookies'];

    function apiService($http, $q, $location, $cookies) {
        // api is on another port
        var port = 5000;
        // 
        var apiRoot = $location.protocol() + "://" + $location.host() + ":" + port;
        return {
            request: request
        }

        function request(req) {
            req.url = apiRoot + req.url;
            if (!req.headers) req.headers = {};
            if ($cookies.get('token') !== undefined) req.headers.Authorization = $cookies.get('token');
            return $http(req);
        }
    }
})();