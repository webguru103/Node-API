/**
 * Created by   on 3/9/2017.
 */
(function () {
    angular
        .module("app")
        .factory("mediaService", mediaService);

    mediaService.$inject = ['$q', 'Upload'];

    function mediaService($q, Upload, saveSmall = true) {
        return {
            uploadImage: uploadImage
        };

        function uploadImage(file) {
            if (angular.isString(file) || file == null) {
                return $q.resolve({});
            }
            var defer = $q.defer();
            Upload.upload({
                url: saveSmall ? '/upload_with_small' : '/upload',
                data: { file: file }
            }).then(function (resp) {
                var filePath = {
                    file: resp.data.file.split('public')[1],
                    file_small: resp.data.file_small.split('public')[1]
                }
                defer.resolve(filePath);
            }, function (resp) {
                defer.reject(resp.data);
            });

            return defer.promise;
        };
    }

})();