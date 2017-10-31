/**
 * Created by   on 3/1/2017.
 */
export enum CommunicationCodes {
    ADD_TRANSLATION = 1,
    UPDATE_TRANSLATION = 2,
    DELETE_TRANSLATION = 3,
    GET_TRANSLATION = 4,

    ADD_CATEGORY = 5,
    GET_CATEGORY = 6,
    UPDATE_CATEGORY = 7,
    DELETE_CATEGORY = 8,
    GET_CATEGORIES = 10,

    ADD_MARKET = 11,
    GET_MARKET = 12,
    UPDATE_MARKET = 13,
    DELETE_MARKET = 14,

    ADD_EVENT = 17,
    GET_EVENT = 18,
    UPDATE_EVENT = 19,
    DELETE_EVENT = 20,
    IS_EVENT = 21,

    ADD_CATEGORY_MAPPING = 22,
    MAP_CATEGORY = 23,
    UN_MAP_CATEGORY = 24,
    UN_MAP_CATEGORY_FOR_ALL_PROVIDERS = 25,
    GET_CATEGORY_MAPPINGS_BY_PROVIDER_ID = 26,
    GET_UNMAPED_CATEGORIES_BY_PROVIDER_ID = 27,

    ADD_MARKET_MAPPING = 28,
    MAP_MARKET = 29,
    UN_MAP_MARKET = 30,
    GET_MARKET_MAPPINGS_BY_PROVIDER_ID = 31,
    GET_UNMAPPED_MARKETS_BY_PROVIDER_ID_AND_SPORT_ID = 32,

    ADD_SELECTION_MAPPING = 33,
    MAP_SELECTION = 34,
    UN_MAP_SELECTION = 35,
    GET_SELECTIONS_MAPPINGS_BY_PROVIDER_ID_AND_MARKET_ID = 36,

    MAP_EVENT = 37,
    GET_EVENT_MAPPINGS_BY_PROVIDER_ID_AND_EVENT_ID = 38,
    GET_EVENT_MAPPINGS = 39,

    MAP_EVENT_MARKET = 41,
    MAP_EVENT_SELECTION = 43,

    ADD_PARTICIPANT_MAPPING = 44,

    ADD_PARTICIPANT = 49,
    DELETE_PARTICIPANT = 50,
    GET_PARTICIPANTS_BY_COUNTRY_ID = 53,
    GET_PARTICIPANTS_BY_LEAGUE_ID = 54,

    GET_ALL_PROVIDERS = 55,
    GET_DEFAULT_PROVIDER = 56,

    UPDATE_PARTICIPANT = 57,
    UPDATE_PARTICIPANT_LEAGUES = 58,
    GET_PARTICIPANT_LEAGUES = 59,
    ADD_SELECTION = 60,
    ADD_PARTICIPANT_TO_LEAGUE = 61,
    GET_CATEGORY_MAPPING = 62,
    GET_PARTICIPANT_MAPPING = 63,
    GET_EVENTS = 64,
    MAP_MARKET_WITH_SELECTIONS = 66,
    UN_MAP_EVENT_MARKET_CASCADE_BY_MARKET_ID = 67,
    ADD_EVENT_MARKET = 68,
    ADD_EVENT_SELECTION = 69,
    GET_EVENT_MARKET = 70,
    GET_EVENT_MARKETS = 71,
    GET_EVENT_SELECTION = 72,
    GET_EVENT_MARKET_SELECTIONS = 73,
    GET_EVENT_MARKETS_COUNT = 76,
    GET_EVENT_SELECTIONS_BY_PROVIDER_ID_AND_EVENT_ID = 79,
    CATEGORY_NOT_MAPPED = 80,
    PARTICIPANT_NOT_MAPPED = 81,
    MARKET_NOT_MAPPED = 82,
    SELECTION_NOT_MAPPED = 83,
    DELETE_CATEGORY_WARNING = 84,
    DELETE_PARTICIPANT_WARNING = 85,
    DELETE_MARKET_WARNING = 86,
    DELETE_SELECTION_WARNING = 87,
    GET_CATEGORY_MAPPING_WARNINGS = 88,
    GET_PARTICIPANT_MAPPING_WARNINGS = 89,
    GET_MARKET_MAPPING_WARNINGS = 90,
    GET_SELECTION_MAPPING_WARNINGS = 91,
    GET_WARNINGS_COUNT = 92,
    GET_MARKET_MAPPING = 93,
    MAP_UNMAPPED_EVENT_SELECTIONS = 94,
    UPDATE_CATEGORY_ORDER = 96,
    UPDATE_MARKETS = 97,
    GET_EVENTS_CATEGORIES_BY_TIME = 98,
    GET_CATEGORIES_BY_TIME = 99,
    GET_BEST_ODDS_BY_EVENT_MARKET_ID = 100,
    GET_PROVIDERS_ODDS_BY_SELECTIONS_IDS = 101,
    GET_EVENTS_WITH_TIPSTER_DEFAULT_MARKET = 102,
    GET_EVENTS_MARKETS = 103,
    UPLOAD_FILES = 104,
    ADD_USER = 105,
    GET_USER = 106,
    UPDATE_USER = 107,
    REMOVE_USER = 108,
    LOG_IN = 109,
    LOG_OUT = 110,
    PLACE_BET = 111,
    GET_BET_SLIPS = 112,
    GET_BET_SLIP = 113,
    UPDATE_BET_SLIP = 114,
    UPDATE_BET_SLIP_DETAIL = 115,
    GET_BET_SLIP_DETAIL = 116,
    GET_BET_SLIP_DETAILS = 117,
    GET_USER_BETTING_STATISTICS = 118,
    GET_EVENT_MARKET_ODDS = 119,
    GET_EVENT_SELECTIONS_ODDS_BY_PROVIDER = 120,
    GET_EVENT_SELECTIONS_ODDS_BY_ALL_PROVIDERS = 121,
    GET_EVENT_SELECTIONS_BEST_PROVIDER_ODDS = 122,
    GET_PROVIDER_PARTICIPANTS_BY_SPORT_ID = 123,
    SEARCH_PARTICIPANT = 124,
    GET_EVENT_SELECTIONS = 125,
    GET_PROVIDER_LEAGUES_BY_SPORT_ID = 127,
    SEARCH_LEAGUE_BY_SPORT_ID = 128,
    GET_PROVIDER = 129,
    UPDATE_PROVIDER = 130,
    STOP_PROVIDER = 131,
    RESTART_PROVIDER = 132,
    UN_MAP_PARTICIPANT_FOR_ALL_PROVIDERS = 133,
    MOVE_EVENTS_TO_LEAGUE = 134,
    DELETE_LEAGUE_EVENTS = 135,
    DELETE_COUNTRY_EVENTS = 136,
    DELETE_SPORT_EVENTS = 137,
    DELETE_EVENT_MARKETS = 138,
    UN_MAP_EVENTS = 139,
    MERGE_CATEGORIES = 141,
    UN_MAP_EVENT_MARKETS_WITH_SELECTIONS = 140,
    APPEND_MAP_CATEGORY = 142,
    UN_MAP_PROVIDER_CATEGORY = 143,
    GET_USERS = 150,
    DELETE_EVENT_MARKET_BY_MARKET_ID_CASCADE = 152,
    UPDATE_EVENTS_CATEGORY_STATUS = 153,
    PARSER_PING = 154,
    UPDATE_PROVIDERS_ORDER = 155,
    UPDATE_PARTICIPANTS_MAPPINGS = 156,
    GET_EVENTS_WITH_MARKETS_ONLY = 157,
    GET_PARTICIPANT = 158,
    UPDATE_CATEGORY_MAPPING = 159,
    UPDATE_CATEGORY_MAPPINGS = 160,
    GET_SELECTION = 161,
    GET_MARKETS = 162,
    GET_SELECTIONS = 163,
    GET_LEADERBOARD = 164,
    GET_USER_TIPSTER_OBJECTS,
    UPDATE_EVENT_SELECION_RESULT,
    GET_EVENT_SELECTIONS_BY_PROVIDER_ID_AND_PROVIDER_SELECTION_ID,
    UPDATE_EVENT_SELECION_RESULTS,
    GET_EVENTS_PROVIDERS,
    RESULT_EVENT_SELECTIONS,
    GET_EVENT_SELECTION_RESULTS,
    RESULT_EVENT,
    GET_EVENT_RESULT,
    GET_EVENTS_RESULTS,
    UPDATE_EVENT_RESULT,
    UPDATE_EVENTS_RESULTS,
    DELETE_EVENT_RESULT,
    ADD_SCOPE,
    GET_SCOPES,
    UPDATE_SCOPE,
    DELETE_SCOPE,
    ADD_STATISTIC_TYPE,
    GET_STATISTIC_TYPES,
    UPDATE_STATISTIC_TYPE,
    DELETE_STATISTIC_TYPE,
    DELETE_RULES,
    ADD_RULES,
    GET_RULES,
    UPDATE_SCOPES,
    UPDATE_STATISTIC_TYPES,
    UN_MAP_SYSTEM_SELECTION,
    GET_EVENT_SELECTIONS_FOR_ALL_PROVIDERS_BY_EVENT_ID,
    DELETE_PARTICIPANT_EVENTS,
    REPLACE_EVENTS_PARTICIPANT,
    UPDATE_PARTICIPANT_MAPPING,
    GET_PARTICIPANT_MAPPINGS,
    MAP_PARTICIPANT
}