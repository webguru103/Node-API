/**
 * Created by   on 3/10/2017.
 */
(function () {
    angular
        .module("app")
        .constant("categoryType", {
            sport: 1,
            country: 2,
            league: 3,
            subleague: 4,
            participant: 5,
            market: 6,
            selection: 6,
            1: 'sport',
            2: 'country',
            3: 'league',
            4: 'subleague',
            5: 'participant',
            6: 'market',
            7: 'selection'
        })
})();

(function () {
    angular
        .module("app")
        .constant("warningType", {
            category: 1,
            participant: 2,
            market: 3,
            selection: 4,
            1: 'category',
            2: 'participant',
            3: 'market',
            4: 'selection'
        })
})();

(function () {
    angular
        .module("app")
        .constant("marketStatus", {
            ACTIVE: 1,
            HIDE: 2
        })
})();

(function () {
    angular
        .module("app")
        .constant("categoryStatus", {
            ACTIVE: 1,
            HIDE: 2
        })
})();

(function () {
    angular
        .module("app")
        .constant("providerStatus", {
            1: 'active',
            2: 'down',
            3: 'stopped',
            4: 'parsing',
            ACTIVE: 1,
            DOWN: 2,
            STOPPED: 3,
            PARSING: 4
        })
})();

(function () {
    angular
        .module("app")
        .constant("userStatus", {
            1: 'active',
            2: 'blocked',
            ACTIVE: 1,
            BLOCKED: 2
        })
})();

(function () {
    angular
        .module("app")
        .constant("eventStatus", {
            1: 'active',
            2: 'suspended',
            3: 'hide',
            5: 'closed',
            ACTIVE: 1,
            SUSPENDED: 2,
            HIDE: 3,
            CLOSED: 5
        })
})();

(function () {
    angular
        .module("app")
        .constant("resultType", {
            WIN: 1,
            LOST: 2,
            CANCEL: 3
        })
})();

(function () {
    angular
        .module("app")
        .constant("betslipStatus", {
            1: 'active',
            2: 'lost',
            3: 'win',
            4: 'halfWin',
            5: 'cancelled',
            ACTIVE: 1,
            LOST: 2,
            WIN: 3,
            HALF_WIN: 4,
            CANCELLED: 5
        })
})();

(function () {
    angular
        .module("app")
        .constant("betslipType", {
            1: 'single',
            2: 'express',
            3: 'system',
            SINGLE: 1,
            EXPRESS: 2,
            SYSTEM: 3
        })
})();

(function () {
    angular
        .module("app")
        .constant("moneyType", {
            1: 'real',
            2: 'virtual',
            3: 'tipster',
            REAL: 1,
            VIRTUAL: 2,
            TIPSTER: 3
        })
})();