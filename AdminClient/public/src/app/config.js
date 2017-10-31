// config

var app =
  angular.module('app')
    .config(
    ['$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
      function ($controllerProvider, $compileProvider, $filterProvider, $provide) {

        // lazy controller, directive and service
        app.controller = $controllerProvider.register;
        app.directive = $compileProvider.directive;
        app.filter = $filterProvider.register;
        app.factory = $provide.factory;
        app.service = $provide.service;
        app.constant = $provide.constant;
        app.value = $provide.value;
      }
    ])
    .config(['$translateProvider', function ($translateProvider) {
      // Register a loader for the static files
      // So, the module will search missing translation tables under the specified urls.
      // Those urls are [prefix][langKey][suffix].
      $translateProvider.useStaticFilesLoader({
        prefix: 'src/l10n/',
        suffix: '.json'
      });
      // Tell the module what language to use by default
      $translateProvider.preferredLanguage('en');
      // Tell the module to store the language in the local storage
      $translateProvider.useLocalStorage();
    }])
    .service('authInterceptor', function ($q, $location, $injector) {
      var service = this;
      service.responseError = function (response) {
        if (response.status == 401) {
          var userService = $injector.get('userService');
          userService.setFailedURL();
          window.location = "/#/login";
        }
        return $q.reject(response);
      };
    })
    .config(['$httpProvider', function ($httpProvider) {
      $httpProvider.interceptors.push('authInterceptor');
    }])