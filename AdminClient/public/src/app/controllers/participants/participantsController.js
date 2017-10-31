/**
 * Created by   on 3/16/2017.
 */
(function () {
    angular
        .module("app")
        .controller("participantsController", participantsController);

    participantsController.$inject = ['$rootScope', '$scope', '$modal', '$translate', 'sports', 'categoryType', 'participantsService', 'commonService', 'categoryService'];

    function participantsController($rootScope, $scope, $modal, $translate, sports, categoryType, participantsService, commonService, categoryService) {
        $scope.categories = sports.data;
        $scope.onSelectNode = function (node) {
            $scope.selectedCategory = node;
            $scope.selectedParticipant = null;
            if (node.original.type_id == categoryType.sport) {
                $scope.loading = true;
                $scope.participants = [];
                participantsService.list({ sport_id: node.id, lang_id: $rootScope.langId }).then(function (data) {
                    $scope.participants = data.data;
                    $scope.loading = false;
                });
            }
        };

        $scope.deleteParticipant = function () {
            $modal.open({
                templateUrl: 'src/app/views/common/yesNoModal.html',
                controller: 'deleteParticipantController',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.participants.delete'),
                            yes: $translate.instant('delete'),
                            no: $translate.instant('cancel')
                        }
                    },
                    participant: function () {
                        return $scope.selectedParticipant;
                    },
                    participants: function () {
                        return $scope.participants;
                    }
                }
            })
        };

        $scope.addParticipant = function () {
            $modal.open({
                templateUrl: 'src/app/views/participants/addParticipant.html',
                controller: 'addParticipantController',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.participants.add'),
                            yes: $translate.instant('add'),
                            no: $translate.instant('cancel')
                        }
                    },
                    sportId: function () {
                        return $scope.selectedCategory.id;
                    },
                    participants: function () {
                        return $scope.participants;
                    }
                }
            })
        };

        $scope.updateParticipant = function () {
            $modal.open({
                templateUrl: 'src/app/views/participants/addParticipant.html',
                controller: 'editParticipantController',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.participants.update'),
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    },
                    selectedParticipant: function () {
                        return $scope.selectedParticipant;
                    }
                }
            })
        };

        $scope.mapParticipant = function () {
            $modal.open({
                templateUrl: 'src/app/views/participants/participantMapping.html',
                controller: 'participantMappingController',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.participants.mapping'),
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    },
                    selectedParticipant: function () {
                        return $scope.selectedParticipant;
                    },
                    selectedSport: function () {
                        return $scope.selectedCategory;
                    },
                    providers: function () {
                        return commonService.getProviders();
                    }
                }
            })
        };

        $scope.selectParticipant = function (participant) {
            if ($scope.selectedParticipant && $scope.selectedParticipant != participant) $scope.selectedParticipant.selected = false;
            $scope.selectedParticipant = participant;
            $scope.selectedParticipant.selected = true;
        };

        $scope.updateParticipantLeagues = function () {
            $modal.open({
                templateUrl: 'src/app/views/participants/participantLeagues.html',
                controller: 'participantsLeagueController',
                size: 'lg',
                resolve: {
                    modalMessage: function () {
                        return {
                            message: $translate.instant('modals.participants.leagues'),
                            yes: $translate.instant('save'),
                            no: $translate.instant('cancel')
                        }
                    },
                    countries: function () {
                        return categoryService.getCategories({ id: $scope.selectedCategory.id, lang_id: $rootScope.langId });
                    },
                    selectedParticipant: function () {
                        return $scope.selectedParticipant;
                    },
                    leagues: function () {
                        return participantsService.getParticipantLeagues($scope.selectedParticipant.id, $rootScope.langId);
                    }
                }
            })
        };
    }
})();