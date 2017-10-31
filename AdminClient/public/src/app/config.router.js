'use strict';

/**
 * Config for the router
 */
var app = angular.module('app');
app.config(function ($stateProvider, $urlRouterProvider, JQ_CONFIG, MODULE_CONFIG) {
    var states = [];

    states.push({
        name: 'app',
        url: '/app',
        templateUrl: "src/tpl/app.html",
        deepStateRedirect: {
            default: "app.categories"
        },
        resolve: {
            getWarningsCount: function (warningService) {
                return warningService.getWarningsCount();
            },
            getPermissions: function (userService) {
                return userService.getPermissions();
            }
        }
    });
    states.push({
        name: 'login',
        url: '/login',
        templateUrl: 'src/app/views/login/login.html',
        controller: "loginController",
        resolve: {
            files: load([
                'src/app/controllers/login/loginController.js'
            ])
        }
    });

    states.push({
        name: 'app.categories',
        url: '/categories',
        templateUrl: 'src/app/views/category/category.html',
        controller: "categoryController",
        resolve: {
            files: load([
                'ui.select',
                'ngFileUpload',
                'angularFileUpload',
                'src/app/controllers/category/categoryController.js',
                'src/app/controllers/category/deleteCategoryController.js',
                'src/app/controllers/category/addCategoryController.js',
                'src/app/controllers/category/categoryMappingController.js',
                'src/app/controllers/category/editCategoryController.js'
            ]),
            categories: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            }
        }
    });

    states.push({
        name: 'app.participants',
        url: '/participants',
        templateUrl: 'src/app/views/participants/participants.html',
        controller: 'participantsController',
        resolve: {
            files: load([
                'ui.select',
                'ngFileUpload',
                'angularFileUpload',
                'src/app/controllers/participants/participantsController.js',
                'src/app/controllers/participants/addParticipantController.js',
                'src/app/controllers/participants/editParticipantController.js',
                'src/app/controllers/participants/deleteParticipantController.js',
                'src/app/controllers/participants/participantMappingController.js',
                'src/app/controllers/participants/participantsLeagueController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            }
        }
    });

    states.push({
        name: 'app.markets',
        url: '/markets',
        template: '<div class="fade-in-up" ui-view></div>',
        deepStateRedirect: {
            default: "app.markets.templates"
        }
    });

    states.push({
        name: 'app.markets.templates',
        url: '/templates',
        templateUrl: 'src/app/views/markets/templates/marketsTemplates.html',
        controller: "marketTemplatesController",
        resolve: {
            files: load([
                'ui.select',
                'ui.sortable',
                'src/app/controllers/markets/templates/marketTemplatesController.js',
                'src/app/controllers/markets/templates/addEditMarketTemplateController.js',
                'src/app/controllers/markets/templates/editSelectionController.js',
                'src/app/controllers/markets/templates/deleteMarketController.js',
                'src/app/controllers/markets/templates/marketMappingController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            },
            providers: function (commonService) {
                return commonService.getProviders();
            }
        }
    });

    states.push({
        name: 'app.markets.displayGroups',
        url: '/templates',
        templateUrl: 'src/app/views/markets/templates/marketsTemplates.html',
        controller: "marketDisplayGroupsController",
        resolve: {
            files: load([
                'ui.sortable',
                'src/app/controllers/markets/displayGroups/marketDisplayGroupsController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            }
        }
    });

    states.push({
        name: 'app.events',
        url: '/events',
        template: '<div class="fade-in-up" ui-view></div>',
        deepStateRedirect: {
            default: "app.events.search"
        }
    });

    states.push({
        name: 'app.events.search',
        url: '/search',
        templateUrl: 'src/app/views/events/events.html',
        controller: "eventsSearchController",
        resolve: {
            files: load([
                'ui.select',
                'src/app/controllers/events/eventsSearchController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            },
            providers: function (commonService) {
                return commonService.getProviders();
            }
        }
    });

    states.push({
        name: 'app.events.event',
        url: '/event/{eventId}',
        templateUrl: 'src/app/views/events/event.html',
        controller: "eventController",
        resolve: {
            files: load([
                'ui.select',
                'src/app/controllers/events/eventController.js'
            ]),
            providers: function (commonService) {
                return commonService.getProviders();
            },
            eventDetails: function (eventService, $rootScope, $stateParams) {
                return eventService.get($stateParams.eventId, $rootScope.langId);
            }
        }
    });

    states.push({
        name: 'app.results',
        url: '/results',
        template: '<div class="fade-in-up" ui-view></div>',
        deepStateRedirect: {
            default: "app.results.search"
        }
    });

    states.push({
        name: 'app.results.search',
        url: '/search',
        templateUrl: 'src/app/views/results/events.html',
        controller: "eventsResultsSearchController",
        resolve: {
            files: load([
                'ui.select',
                'src/app/controllers/results/eventsResultsSearchController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            },
            providers: function (commonService) {
                return commonService.getProviders();
            }
        }
    });

    states.push({
        name: 'app.results.event',
        url: '/event/{eventId}',
        templateUrl: 'src/app/views/results/event.html',
        controller: "eventResultController",
        resolve: {
            files: load([
                'ui.select',
                'src/app/controllers/results/scopeResultingController.js',
                'src/app/controllers/results/eventResultController.js'
            ]),
            providers: function (commonService) {
                return commonService.getProviders();
            },
            eventDetails: function (eventService, $rootScope, $stateParams) {
                return eventService.get($stateParams.eventId, $rootScope.langId);
            }
        }
    });

    states.push({
        name: 'app.betslips',
        url: '/betslips',
        templateUrl: 'src/app/views/betslips/betslips.html',
        controller: "betslipsController",
        resolve: {
            files: load([
                'ui.select',
                'src/app/controllers/betslips/betslipController.js',
                'src/app/controllers/betslips/betslipsController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            },
            providers: function (commonService) {
                return commonService.getProviders();
            }
        }
    });

    states.push({
        name: 'app.users',
        url: '/users',
        templateUrl: 'src/app/views/users/users.html',
        controller: "usersController",
        resolve: {
            files: load([
                'ngFileUpload',
                'angularFileUpload',
                'src/app/controllers/users/usersController.js'
            ])
        }
    });

    states.push({
        name: 'app.users.user',
        url: '/{id}',
        templateUrl: 'src/app/views/users/user.html',
        controller: "userController",
        resolve: {
            files: load([
                'ngFileUpload',
                'angularFileUpload',
                'src/app/controllers/users/userController.js'
            ])
        }
    });

    states.push({
        name: 'app.providers',
        url: '/providers',
        templateUrl: 'src/app/views/providers/providers.html',
        controller: "providersController",
        resolve: {
            files: load([
                'ui.select',
                'ui.sortable',
                'ngFileUpload',
                'angularFileUpload',
                'src/app/controllers/providers/providersController.js'
            ]),
            providers: function (commonService) {
                return commonService.getProviders();
            }
        }
    });

    states.push({
        name: 'app.admins',
        url: '/admins',
        templateUrl: 'src/app/views/admins/admins.html',
        controller: "usersController",
        resolve: {
            files: load([
                'ngFileUpload',
                'angularFileUpload',
                'src/app/controllers/users/usersController.js',
                'src/app/controllers/admins/adminAddController.js'
            ])
        }
    });

    states.push({
        name: 'app.admins.admin',
        url: '/{id}',
        templateUrl: 'src/app/views/admins/admin.html',
        controller: "adminController",
        resolve: {
            files: load([
                'src/app/controllers/admins/adminController.js'
            ]),
            user: function ($stateParams, userService) {
                return userService.find({ id: $stateParams.id }).then(function (data) {
                    return data.data.data[0];
                });
            },
            permissions: function (userService) {
                return userService.allPermissions().then(function (data) {
                    return data.data.data;
                })
            }

        }
    });

    states.push({
        name: 'app.mapping',
        url: '/mapping',
        template: '<div class="fade-in-up" ui-view></div>',
        deepStateRedirect: {
            default: "app.mapping.leagues"
        }
    });

    states.push({
        name: 'app.mapping.leagues',
        url: '/leagues',
        templateUrl: 'src/app/views/mapping/category/league.html',
        controller: "leagueMappingController",
        resolve: {
            files: load([
                'ui.select',
                'src/app/constants/categoryType.js',
                'src/app/controllers/mapping/category/leagueMappingController.js'
            ]),
            providers: function (commonService) {
                return commonService.getProviders();
            },
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            }
        }
    });

    states.push({
        name: 'app.mapping.participants',
        url: '/participants',
        templateUrl: 'src/app/views/mapping/participants/participants.html',
        controller: "participantsMappingController",
        resolve: {
            files: load([
                'ui.select',
                'src/app/controllers/mapping/participants/participantsMappingController.js'
            ]),
            providers: function (commonService) {
                return commonService.getProviders();
            },
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            }
        }
    });

    states.push({
        name: 'app.mapping.warnings',
        url: '/warnings',
        templateUrl: 'src/app/views/warnings/warnings.html',
        controller: "warningsController",
        resolve: {
            files: load([
                'src/app/controllers/warnings/warningsController.js'
            ]),
            categoryWarnings: function (warningService, warningType) {
                return warningService.getWarningsByType(warningType.category)
            },
            participantWarnings: function (warningService, warningType) {
                return warningService.getWarningsByType(warningType.participant)
            },
            marketWarnings: function (warningService, warningType) {
                return warningService.getWarningsByType(warningType.market)
            },
            selectionWarnings: function (warningService, warningType) {
                return warningService.getWarningsByType(warningType.selection)
            }
        },
        deepStateRedirect: {
            default: "app.mapping.warnings.category"
        }
    });

    states.push({
        name: 'app.mapping.warnings.category',
        url: '/category',
        templateUrl: 'src/app/views/warnings/categoryMappingWarnings.html',
        controller: "categoryWarningsController",
        resolve: {
            files: load([
                'src/app/controllers/warnings/categoryWarningsController.js'
            ])
        }
    });
    states.push({
        name: 'app.mapping.warnings.participant',
        url: '/participant',
        templateUrl: 'src/app/views/warnings/participantMappingWarnings.html',
        controller: "participantWarningsController",
        resolve: {
            files: load([
                'src/app/controllers/warnings/participantWarningsController.js'
            ])
        }
    });
    states.push({
        name: 'app.mapping.warnings.market',
        url: '/market',
        templateUrl: 'src/app/views/warnings/marketMappingWarnings.html',
        controller: "marketWarningsController",
        resolve: {
            files: load([
                'src/app/controllers/warnings/marketWarningsController.js'
            ])
        }
    });
    states.push({
        name: 'app.mapping.warnings.selection',
        url: '/selection',
        templateUrl: 'src/app/views/warnings/selectionMappingWarnings.html',
        controller: "selectionWarningsController",
        resolve: {
            files: load([
                'src/app/controllers/warnings/selectionWarningsController.js'
            ])
        }
    });

    states.push({
        name: 'app.settings',
        url: '/settings',
        template: '<div class="fade-in-up" ui-view></div>',
        deepStateRedirect: {
            default: "app.settings.scopes"
        }
    });

    states.push({
        name: 'app.settings.scopes',
        url: '/scopes',
        templateUrl: 'src/app/views/settings/scopes.html',
        controller: "scopesController",
        resolve: {
            files: load([
                'ui.select',
                'ui.sortable',
                'src/app/controllers/settings/scopesController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            }
        }
    });

    states.push({
        name: 'app.settings.statisticTypes',
        url: '/statisticTypes',
        templateUrl: 'src/app/views/settings/statisticTypes.html',
        controller: "statisticTypesController",
        resolve: {
            files: load([
                'ui.select',
                'ui.sortable',
                'src/app/controllers/settings/statisticTypesController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            }
        }
    });

    states.push({
        name: 'app.settings.resultRules',
        url: '/resultRules',
        templateUrl: 'src/app/views/settings/resultRules.html',
        controller: "resultRulesController",
        resolve: {
            files: load([
                'ui.select',
                'src/app/controllers/settings/resultRulesController.js'
            ]),
            sports: function (categoryService, $rootScope) {
                return categoryService.getCategories({ lang_id: $rootScope.langId, parent_id: "", status_id: "" });
            }
        }
    });

    // states.push({
    //     name: 'app.markets',
    //     url: '/markets',
    //     template:"<div ui-view></div>",
    //     deepStateRedirect: {
    //         default: "app.markets.templates"
    //     }
    // });

    // states.push({
    //     name: 'app.markets.templates',
    //     url: '/templates',
    //     templateUrl: 'src/app/views/markets/templates/marketsTemplates.html'
    // });

    // states.push({
    //     name: 'app.markets.groups',
    //     url: '/groups',
    //     templateUrl: 'src/app/views/markets/groups/marketGroups.html'
    // });
    //
    // states.push({
    //     name: 'app.markets.displayTypes',
    //     url: '/displayTypes',
    //     templateUrl: 'src/app/views/markets/displayTypes/marketDisplayTypes.html'
    // });


    angular.forEach(states, function (state) {
        $stateProvider.state(state);
    });
    $urlRouterProvider.otherwise("/app/categories");

    function load(srcs, callback) {
        return function ($ocLazyLoad, $q) {
            var deferred = $q.defer();
            var promise = false;
            srcs = angular.isArray(srcs) ? srcs : srcs.split(/\s+/);
            if (!promise) {
                promise = deferred.promise;
            }
            angular.forEach(srcs, function (src) {
                promise = promise.then(function () {
                    if (JQ_CONFIG[src]) {
                        return $ocLazyLoad.load(JQ_CONFIG[src]);
                    }
                    angular.forEach(MODULE_CONFIG, function (module) {
                        if (module.name == src) {
                            name = module.name;
                        } else {
                            name = src;
                        }
                    });
                    return $ocLazyLoad.load(name);
                });
            });
            deferred.resolve();
            return callback ? promise.then(function () {
                return callback();
            }) : promise;

        };
    }
});


app.run(function ($rootScope, $state, $window, $timeout) {
    $rootScope.$state = $state;
    $rootScope.$on("$stateChangeSuccess", function () {
        $timeout(function () {
            $window.ga('send', 'pageview', $window.location.pathname + $window.location.hash);
        });
    });
});