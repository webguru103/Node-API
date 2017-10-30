/**
 * Created by   on 3/14/2017.
 */
(function () {
    var app = angular
        .module("app");
    app.controller("categoryTreeController", categoryTreeController);
    app.directive("categoryTree", categoryTree);

    function categoryTree() {
        return {
            template: `<div style="padding-top: 15px; padding-bottom: 15px" 
            js-tree="treeConfig" 
            ng-model="categories" 
            should-apply="ignoreModelChanges()" 
            tree="treeInstance" 
            tree-events-obj="treeEventsObj"></div>`,
            controller: 'categoryTreeController',
            restrict: 'EA',
            scope: {
                categories: '=',
                onSelectNode: '&',
                level: '@',
                sortable: '@'
            }
        };
    }

    categoryTreeController.$inject = ['$rootScope', '$scope', '$timeout', 'categoryService', 'categoryType', 'categoryStatus'];

    function categoryTreeController($rootScope, $scope, $timeout, categoryService, categoryType, categoryStatus) {
        var checkCallBack = function (operation, node, node_parent, node_position, more) {
            if (operation === "move_node") {
                if (node.original.type_id === categoryType.sport && node_parent.parent === null) return true;
                if (node.original.type_id === categoryType.country && node_parent.original && node.parent === node_parent.id && node_parent.original && node_parent.original.type_id === categoryType.sport) return true;
                if (node.original.type_id === categoryType.league && node_parent.original && node.parent === node_parent.id && node_parent.original && node_parent.original.type_id === categoryType.sport) return true;
                if (node.original.type_id === categoryType.league && node_parent.original && node.parent === node_parent.id && node_parent.original.type_id === categoryType.country) return true;
                return false;
            }
            return true;
        };

        var plugins = ["themes", "wholerow", "types"];
        if ($scope.sortable) {
            plugins.push("dnd");
        }

        $scope.treeConfig = {
            core: {
                multiple: false,
                animation: true,
                worker: true,
                themes: { "stripes": false },
                check_callback: checkCallBack
            },
            dnd: {
                check_while_dragging: true
            },
            plugins: plugins,
            version: 1
        };

        $scope.ignoreModelChanges = function () {
            return true;
        };

        var loadNodeCategories = function (event, node) {
            if (node.node.id == "#") return;
            if ($scope.level && $scope.level <= node.node.original.type_id) return;
            categoryService.getCategories({ parent_id: node.node.id, lang_id: $rootScope.langId, status_id: "" }).then(function (data) {
                node.node.state.loaded = true;
                if (data.data.length > 0) {
                    parseCategories(data.data.reverse());
                    $timeout(function () {
                        node.instance.open_node(node.node);
                    }, 10);
                }
            });
        };

        var parseCategories = function (categoriesToParse) {
            categoriesToParse.forEach(function (cat) {
                var exists = false;
                for (var i = 0; i < $scope.categories.length; i++) {
                    var categoryToCheck = $scope.categories[i];
                    if (categoryToCheck.id == cat.id) {
                        exists = true;
                        break;
                    }
                }

                if (!exists) {
                    cat.text = cat.name;
                    cat.parent = cat.parent_id;
                    cat.id = cat.id.toString();
                    cat.icon = cat.icon_small_url;
                    if (cat.status_id == categoryStatus.HIDE) cat.li_attr = { "class": "node-inactive" };
                    if (cat.status_id == categoryStatus.ACTIVE) cat.li_attr = { "class": "node-active" };
                    if (cat.parent == null) {
                        cat.parent = "#"
                    }
                    else {
                        cat.parent = cat.parent.toString()
                    }
                    cat.state = { loaded: false };
                    $scope.categories.push(cat);
                }
            });
        };

        var onSelectNode = function (event, node) {
            node.node.instance = $scope.treeInstance;
            $scope.onSelectNode(node);
        };

        var onMove = function (e, data) {
            // item being moved
            var itemId = data.node.id;
            //old position
            var oldPostionIndex = data.old_position;
            //new position
            var newPostionIndex = data.position;

            var step = Math.abs(oldPostionIndex - newPostionIndex);
            var direction = (newPostionIndex - oldPostionIndex) / step;

            categoryService.updateCategoryOrder(itemId, data.node.original.type_id, data.node.original.parent === "#" ? null : data.node.original.parent, step, direction);
        };

        $scope.treeEventsObj = {
            'load_node': loadNodeCategories,
            'select_node': onSelectNode,
            'move_node.jstree': onMove
        };

        let toParse = Object.assign([], $scope.categories);
        $scope.categories = [];
        parseCategories(toParse);
    }
})();