var PO_Module_Factory = function () {
  var PO = {
    name: 'PO',
    defaultElementNamespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program',
    typeInfos: [{
        localName: 'IceHockey',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'ice-hockey'
        },
        baseTypeInfo: '.SportSpecificDetailsWithMatchTime',
        propertyInfos: [{
            name: 'setScore',
            minOccurs: 0,
            maxOccurs: 4,
            collection: true,
            elementName: {
              localPart: 'set-score',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport'
            },
            typeInfo: '.SetScore'
          }, {
            name: 'period',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'period'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Volleyball',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'volleyball'
        },
        baseTypeInfo: '.SportSpecificDetails',
        propertyInfos: [{
            name: 'setScore',
            minOccurs: 0,
            maxOccurs: 6,
            collection: true,
            elementName: {
              localPart: 'set-score',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport'
            },
            typeInfo: '.SetScore'
          }, {
            name: 'gameScore',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'game-score'
            },
            type: 'attribute'
          }, {
            name: 'serverParticipantType',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'server-participant-type'
            },
            type: 'attribute'
          }, {
            name: 'period',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'period'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'BettingProgram.Period',
        typeName: null,
        propertyInfos: [{
            name: 'name',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'sportName',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'sport-name'
            },
            type: 'attribute'
          }, {
            name: 'translationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'translation-id'
            },
            type: 'attribute'
          }, {
            name: 'shortTranslationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'short-translation-id'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Translation',
        typeName: 'translation',
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Token',
            type: 'value'
          }, {
            name: 'id',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'id'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ProgramStructure',
        typeName: 'program-structure',
        propertyInfos: [{
            name: 'id',
            required: true,
            typeInfo: 'Long',
            attributeName: {
              localPart: 'id'
            },
            type: 'attribute'
          }, {
            name: 'translationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'translation-id'
            },
            type: 'attribute'
          }, {
            name: 'orderPosition',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'order-position'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'SetScore',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'set-score'
        },
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Token',
            type: 'value'
          }, {
            name: 'setNumber',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'set-number'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'EventGroup',
        typeName: 'event-group',
        baseTypeInfo: '.ProgramStructure',
        propertyInfos: [{
            name: 'combinationLimit',
            elementName: 'combination-limit',
            typeInfo: '.CombinationLimit'
          }, {
            name: 'event',
            minOccurs: 0,
            collection: true,
            typeInfo: '.Event'
          }, {
            name: 'outright',
            minOccurs: 0,
            collection: true,
            typeInfo: '.Market'
          }, {
            name: 'regionId',
            typeInfo: 'Long',
            attributeName: {
              localPart: 'region-id'
            },
            type: 'attribute'
          }, {
            name: 'sportId',
            typeInfo: 'Long',
            attributeName: {
              localPart: 'sport-id'
            },
            type: 'attribute'
          }, {
            name: 'type',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'AmericanFootball',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'american-football'
        },
        baseTypeInfo: '.ForthcomingSport',
        propertyInfos: [{
            name: 'otherAttributes',
            type: 'anyAttribute'
          }]
      }, {
        localName: 'BettingProgramTranslations',
        typeName: null,
        baseTypeInfo: '.ErrorResponseType',
        propertyInfos: [{
            name: 'translation',
            minOccurs: 0,
            collection: true,
            typeInfo: '.Translation'
          }, {
            name: 'additional',
            minOccurs: 0,
            collection: true,
            typeInfo: '.BettingProgramTranslations.Additional'
          }, {
            name: 'language',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'language'
            },
            type: 'attribute'
          }, {
            name: 'generationDate',
            typeInfo: 'DateTime',
            attributeName: {
              localPart: 'generation-date'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Soccer.Score',
        typeName: null,
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Token',
            type: 'value'
          }, {
            name: 'matchTime',
            typeInfo: 'Duration',
            attributeName: {
              localPart: 'match-time'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Market',
        typeName: 'market',
        propertyInfos: [{
            name: 'betType',
            elementName: 'bet-type',
            typeInfo: '.BetType'
          }, {
            name: 'outcome',
            required: true,
            collection: true,
            typeInfo: '.Outcome'
          }, {
            name: 'id',
            required: true,
            typeInfo: 'Long',
            attributeName: {
              localPart: 'id'
            },
            type: 'attribute'
          }, {
            name: 'shortcut',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'shortcut'
            },
            type: 'attribute'
          }, {
            name: 'state',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'state'
            },
            type: 'attribute'
          }, {
            name: 'translationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'translation-id'
            },
            type: 'attribute'
          }, {
            name: 'mostBalanced',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'most-balanced'
            },
            type: 'attribute'
          }, {
            name: 'live',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'live'
            },
            type: 'attribute'
          }, {
            name: 'startDate',
            typeInfo: 'DateTime',
            attributeName: {
              localPart: 'start-date'
            },
            type: 'attribute'
          }, {
            name: 'endDate',
            typeInfo: 'DateTime',
            attributeName: {
              localPart: 'end-date'
            },
            type: 'attribute'
          }, {
            name: 'shortTranslationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'short-translation-id'
            },
            type: 'attribute'
          }, {
            name: 'descriptionTranslationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'description-translation-id'
            },
            type: 'attribute'
          }, {
            name: 'expectedWinners',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'expected-winners'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'SportSpecificDetailsWithMatchTime',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'sport-specific-details-with-match-time'
        },
        baseTypeInfo: '.SportSpecificDetails',
        propertyInfos: [{
            name: 'matchTime',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'match-time'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Soccer.CardCount',
        typeName: null,
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Int',
            type: 'value'
          }, {
            name: 'participantType',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'participant-type'
            },
            type: 'attribute'
          }, {
            name: 'color',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'color'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Outcome',
        typeName: 'outcome',
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Decimal',
            type: 'value'
          }, {
            name: 'id',
            required: true,
            typeInfo: 'Long',
            attributeName: {
              localPart: 'id'
            },
            type: 'attribute'
          }, {
            name: 'participantType',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'participant-type'
            },
            type: 'attribute'
          }, {
            name: 'outcomeTypeName',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'outcome-type-name'
            },
            type: 'attribute'
          }, {
            name: 'state',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'state'
            },
            type: 'attribute'
          }, {
            name: 'translationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'translation-id'
            },
            type: 'attribute'
          }, {
            name: 'shortTranslationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'short-translation-id'
            },
            type: 'attribute'
          }, {
            name: 'orderPosition',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'order-position'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ForthcomingSport',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'forthcoming-sport'
        },
        baseTypeInfo: '.SportSpecificDetails',
        propertyInfos: [{
            name: 'otherAttributes',
            type: 'anyAttribute'
          }, {
            name: 'any',
            required: true,
            allowDom: false,
            mixed: false,
            type: 'anyElement'
          }]
      }, {
        localName: 'Participant',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/common',
          localPart: 'participant'
        },
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Token',
            type: 'value'
          }, {
            name: 'type',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }, {
            name: 'translationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'translation-id'
            },
            type: 'attribute'
          }, {
            name: 'shortTranslationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'short-translation-id'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Soccer',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'soccer'
        },
        baseTypeInfo: '.SportSpecificDetailsWithMatchTime',
        propertyInfos: [{
            name: 'cardCount',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'card-count',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport'
            },
            typeInfo: '.Soccer.CardCount'
          }, {
            name: 'card',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'card',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport'
            },
            typeInfo: '.Soccer.Card'
          }, {
            name: 'score',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'score',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport'
            },
            typeInfo: '.Soccer.Score'
          }, {
            name: 'period',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'period'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Baseball',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'baseball'
        },
        baseTypeInfo: '.ForthcomingSport',
        propertyInfos: [{
            name: 'otherAttributes',
            type: 'anyAttribute'
          }]
      }, {
        localName: 'BettingProgram.BetType',
        typeName: null,
        propertyInfos: [{
            name: 'name',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'sportName',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'sport-name'
            },
            type: 'attribute'
          }, {
            name: 'translationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'translation-id'
            },
            type: 'attribute'
          }, {
            name: 'shortTranslationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'short-translation-id'
            },
            type: 'attribute'
          }, {
            name: 'descriptionTranslationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'description-translation-id'
            },
            type: 'attribute'
          }, {
            name: 'orderPosition',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'order-position'
            },
            type: 'attribute'
          }, {
            name: 'sportId',
            typeInfo: 'Long',
            attributeName: {
              localPart: 'sport-id'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'BettingProgram.Sport',
        typeName: null,
        baseTypeInfo: '.ProgramStructure',
        propertyInfos: [{
            name: 'name',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'OkResponse',
        typeName: null,
        baseTypeInfo: '.ErrorResponseType'
      }, {
        localName: 'ErrorDetails',
        typeName: null,
        baseTypeInfo: '.ErrorResponseType',
        propertyInfos: [{
            name: 'errorDetail',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'error-detail',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: '.ErrorDetail'
          }]
      }, {
        localName: 'TranslatedMessage',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/common',
          localPart: 'translated-message'
        },
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Token',
            type: 'value'
          }, {
            name: 'language',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'language'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'BetType',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/common',
          localPart: 'bet-type'
        },
        propertyInfos: [{
            name: 'oddsValue',
            minOccurs: 0,
            collection: true,
            elementName: {
              localPart: 'odds-value',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/common'
            },
            typeInfo: 'Token'
          }, {
            name: 'name',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'translation',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'translation'
            },
            type: 'attribute'
          }, {
            name: 'shortTranslation',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'short-translation'
            },
            type: 'attribute'
          }, {
            name: 'descriptionTranslation',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'description-translation'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Soccer.Card',
        typeName: null,
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Token',
            type: 'value'
          }, {
            name: 'matchTime',
            typeInfo: 'Duration',
            attributeName: {
              localPart: 'match-time'
            },
            type: 'attribute'
          }, {
            name: 'participantType',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'participant-type'
            },
            type: 'attribute'
          }, {
            name: 'color',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'color'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Event',
        typeName: 'event',
        propertyInfos: [{
            name: 'sportSpecificDetails',
            elementName: 'sport-specific-details',
            typeInfo: '.SportSpecificDetails'
          }, {
            name: 'participant',
            minOccurs: 0,
            collection: true,
            typeInfo: '.Participant'
          }, {
            name: 'market',
            minOccurs: 0,
            collection: true,
            typeInfo: '.Market'
          }, {
            name: 'tvChannelInfo',
            minOccurs: 0,
            collection: true,
            elementName: 'tv-channel-info',
            typeInfo: '.TvChannelInfo'
          }, {
            name: 'id',
            required: true,
            typeInfo: 'Long',
            attributeName: {
              localPart: 'id'
            },
            type: 'attribute'
          }, {
            name: 'betradarId',
            typeInfo: 'Long',
            attributeName: {
              localPart: 'betradar-id'
            },
            type: 'attribute'
          }, {
            name: 'state',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'state'
            },
            type: 'attribute'
          }, {
            name: 'shortcut',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'shortcut'
            },
            type: 'attribute'
          }, {
            name: 'willBecomeLive',
            required: true,
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'will-become-live'
            },
            type: 'attribute'
          }, {
            name: 'startDate',
            typeInfo: 'DateTime',
            attributeName: {
              localPart: 'start-date'
            },
            type: 'attribute'
          }, {
            name: 'endDate',
            typeInfo: 'DateTime',
            attributeName: {
              localPart: 'end-date'
            },
            type: 'attribute'
          }, {
            name: 'betradarLiveSportsCenter',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'betradar-live-sports-center'
            },
            type: 'attribute'
          }, {
            name: 'neutralGround',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'neutral-ground'
            },
            type: 'attribute'
          }, {
            name: 'firstLegScore',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'first-leg-score'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'TvChannelInfo',
        typeName: 'tv-channel-info',
        propertyInfos: [{
            name: 'tvChannelId',
            required: true,
            typeInfo: 'Long',
            attributeName: {
              localPart: 'tv-channel-id'
            },
            type: 'attribute'
          }, {
            name: 'tvChannelName',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'tv-channel-name'
            },
            type: 'attribute'
          }, {
            name: 'startDate',
            typeInfo: 'DateTime',
            attributeName: {
              localPart: 'start-date'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ErrorDetail',
        typeName: null,
        baseTypeInfo: '.ErrorResponseType',
        propertyInfos: [{
            name: 'errorDetailHttpStatusCode',
            required: true,
            elementName: {
              localPart: 'error-detail-http-status-code',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: 'Int'
          }, {
            name: 'errorDetailErrorCode',
            required: true,
            elementName: {
              localPart: 'error-detail-error-code',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: 'Token'
          }, {
            name: 'errorDetailDescription',
            required: true,
            elementName: {
              localPart: 'error-detail-description',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: 'Token'
          }, {
            name: 'errorDetailMessage',
            required: true,
            collection: true,
            elementName: {
              localPart: 'error-detail-message',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: '.TranslatedMessage'
          }]
      }, {
        localName: 'BettingProgram.OutcomeType',
        typeName: null,
        propertyInfos: [{
            name: 'name',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }, {
            name: 'shortTranslationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'short-translation-id'
            },
            type: 'attribute'
          }, {
            name: 'translationId',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'translation-id'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Basketball',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'basketball'
        },
        baseTypeInfo: '.SportSpecificDetailsWithMatchTime',
        propertyInfos: [{
            name: 'setScore',
            minOccurs: 0,
            maxOccurs: 5,
            collection: true,
            elementName: {
              localPart: 'set-score',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport'
            },
            typeInfo: '.SetScore'
          }, {
            name: 'period',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'period'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'SportSpecificDetails',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'sport-specific-details'
        },
        propertyInfos: [{
            name: 'matchScore',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'match-score'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'AccountBalance',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/common',
          localPart: 'account-balance'
        },
        propertyInfos: [{
            name: 'account',
            required: true,
            collection: true,
            elementName: {
              localPart: 'account',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/common'
            },
            typeInfo: '.AccountBalance.Account'
          }]
      }, {
        localName: 'BettingProgram',
        typeName: null,
        baseTypeInfo: '.ErrorResponseType',
        propertyInfos: [{
            name: 'sport',
            minOccurs: 0,
            collection: true,
            typeInfo: '.BettingProgram.Sport'
          }, {
            name: 'region',
            minOccurs: 0,
            collection: true,
            typeInfo: '.BettingProgram.Region'
          }, {
            name: 'betType',
            minOccurs: 0,
            collection: true,
            elementName: 'bet-type',
            typeInfo: '.BettingProgram.BetType'
          }, {
            name: 'outcomeType',
            minOccurs: 0,
            collection: true,
            elementName: 'outcome-type',
            typeInfo: '.BettingProgram.OutcomeType'
          }, {
            name: 'period',
            minOccurs: 0,
            collection: true,
            typeInfo: '.BettingProgram.Period'
          }, {
            name: 'eventGroup',
            required: true,
            collection: true,
            elementName: 'event-group',
            typeInfo: '.EventGroup'
          }, {
            name: 'generationDate',
            required: true,
            typeInfo: 'DateTime',
            attributeName: {
              localPart: 'generation-date'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ErrorResponseType',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error',
          localPart: 'error-response-type'
        },
        propertyInfos: [{
            name: 'errorHttpStatusCode',
            elementName: {
              localPart: 'error-http-status-code',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: 'Int'
          }, {
            name: 'errorCode',
            elementName: {
              localPart: 'error-code',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: 'Token'
          }, {
            name: 'errorDetailLink',
            elementName: {
              localPart: 'error-detail-link',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            }
          }, {
            name: 'errorMessage',
            elementName: {
              localPart: 'error-message',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: '.TranslatedMessage'
          }, {
            name: 'errorCausedByException',
            elementName: {
              localPart: 'error-caused-by-exception',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: '.ErrorResponseType.ErrorCausedByException'
          }, {
            name: 'technicalError',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'technical-error'
            },
            type: 'attribute'
          }, {
            name: 'errorOccurred',
            required: true,
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'error-occurred'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Handball',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'handball'
        },
        baseTypeInfo: '.ForthcomingSport',
        propertyInfos: [{
            name: 'otherAttributes',
            type: 'anyAttribute'
          }]
      }, {
        localName: 'PixelUrl',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/common',
          localPart: 'pixel-url'
        },
        propertyInfos: [{
            name: 'url',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'url'
            },
            type: 'attribute'
          }, {
            name: 'isHtml',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'is-html'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'BettingProgramLastModified',
        typeName: null,
        baseTypeInfo: '.ErrorResponseType',
        propertyInfos: [{
            name: 'entireAndTranslations',
            required: true,
            elementName: 'entire-and-translations',
            typeInfo: 'DateTime'
          }, {
            name: '_volatile',
            required: true,
            elementName: 'volatile',
            typeInfo: 'DateTime'
          }]
      }, {
        localName: 'Money',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/common',
          localPart: 'money'
        },
        propertyInfos: [{
            name: 'amount',
            required: true,
            typeInfo: 'Decimal',
            attributeName: {
              localPart: 'amount'
            },
            type: 'attribute'
          }, {
            name: 'currencyCode',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'currency-code'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'ErrorResponse',
        typeName: null,
        baseTypeInfo: '.ErrorResponseType'
      }, {
        localName: 'ErrorResponseType.ErrorCausedByException',
        typeName: null,
        propertyInfos: [{
            name: 'name',
            required: true,
            elementName: {
              localPart: 'name',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: 'Token'
          }, {
            name: 'message',
            required: true,
            elementName: {
              localPart: 'message',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: 'Token'
          }, {
            name: 'stacktrace',
            elementName: {
              localPart: 'stacktrace',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
            },
            typeInfo: 'Token'
          }]
      }, {
        localName: 'CombinationLimit',
        typeName: 'combination-limit',
        propertyInfos: [{
            name: 'maxWin',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'max-win'
            },
            type: 'attribute'
          }, {
            name: 'maxStake',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'max-stake'
            },
            type: 'attribute'
          }, {
            name: 'minOdds',
            typeInfo: 'Decimal',
            attributeName: {
              localPart: 'min-odds'
            },
            type: 'attribute'
          }, {
            name: 'minBets',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'min-bets'
            },
            type: 'attribute'
          }, {
            name: 'maxBets',
            typeInfo: 'Int',
            attributeName: {
              localPart: 'max-bets'
            },
            type: 'attribute'
          }, {
            name: 'nightBlock',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'night-block'
            },
            type: 'attribute'
          }, {
            name: 'limitFactor',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'limit-factor'
            },
            type: 'attribute'
          }, {
            name: 'nightlyLimitFactor',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'nightly-limit-factor'
            },
            type: 'attribute'
          }, {
            name: 'poolLimit',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'pool-limit'
            },
            type: 'attribute'
          }, {
            name: 'poolLimitFactor',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'pool-limit-factor'
            },
            type: 'attribute'
          }, {
            name: 'maxLiveStake',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'max-live-stake'
            },
            type: 'attribute'
          }, {
            name: 'maxLiveNetWin',
            typeInfo: 'Double',
            attributeName: {
              localPart: 'max-live-net-win'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'BettingProgramTranslations.Additional',
        typeName: null,
        baseTypeInfo: '.Translation',
        propertyInfos: [{
            name: 'type',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'BettingProgram.Region',
        typeName: null,
        baseTypeInfo: '.ProgramStructure',
        propertyInfos: [{
            name: 'name',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'name'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'BeachVolleyball',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'beach-volleyball'
        },
        baseTypeInfo: '.SportSpecificDetails',
        propertyInfos: [{
            name: 'setScore',
            minOccurs: 0,
            maxOccurs: 4,
            collection: true,
            elementName: {
              localPart: 'set-score',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport'
            },
            typeInfo: '.SetScore'
          }, {
            name: 'gameScore',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'game-score'
            },
            type: 'attribute'
          }, {
            name: 'serverParticipantType',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'server-participant-type'
            },
            type: 'attribute'
          }, {
            name: 'period',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'period'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'AccountBalance.Account',
        typeName: null,
        propertyInfos: [{
            name: 'value',
            typeInfo: 'Decimal',
            type: 'value'
          }, {
            name: 'type',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'type'
            },
            type: 'attribute'
          }, {
            name: 'currency',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'currency'
            },
            type: 'attribute'
          }]
      }, {
        localName: 'Tennis',
        typeName: {
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport',
          localPart: 'tennis'
        },
        baseTypeInfo: '.SportSpecificDetails',
        propertyInfos: [{
            name: 'setScore',
            minOccurs: 0,
            maxOccurs: 5,
            collection: true,
            elementName: {
              localPart: 'set-score',
              namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/program\/sport'
            },
            typeInfo: '.SetScore'
          }, {
            name: 'gameScore',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'game-score'
            },
            type: 'attribute'
          }, {
            name: 'tieBreak',
            typeInfo: 'Boolean',
            attributeName: {
              localPart: 'tie-break'
            },
            type: 'attribute'
          }, {
            name: 'serverParticipantType',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'server-participant-type'
            },
            type: 'attribute'
          }, {
            name: 'matchFormat',
            typeInfo: 'Token',
            attributeName: {
              localPart: 'match-format'
            },
            type: 'attribute'
          }, {
            name: 'period',
            required: true,
            typeInfo: 'Token',
            attributeName: {
              localPart: 'period'
            },
            type: 'attribute'
          }]
      }, {
        type: 'enumInfo',
        localName: 'StateEnum',
        baseTypeInfo: 'Token',
        values: ['open', 'paused']
      }, {
        type: 'enumInfo',
        localName: 'SoccerCardColorEnum',
        baseTypeInfo: 'Token',
        values: ['red', 'yellow', 'yellow red']
      }, {
        type: 'enumInfo',
        localName: 'HttpMethodEnum',
        baseTypeInfo: 'Token',
        values: ['post', 'get']
      }, {
        type: 'enumInfo',
        localName: 'SportsEnum',
        baseTypeInfo: 'Token',
        values: ['none', 'soccer', 'tennis', 'ice-hockey', 'electronic-gaming', 'chess', 'american-football', 'basketball', 'golf', 'celebrity', 'finance', 'politics', 'alpine-skiing', 'boxing', 'snooker', 'handball', 'swimming', 'ski-jumping', 'biathlon', 'darts', 'formula-1', 'baseball', 'weather', 'rugby-union', 'freestyle-skiing', 'volleyball', 'cycling', 'nordic-skiing', 'xxx', 'cricket', 'field-hockey', 'sailing', 'rowing', 'curling', 'water-polo', 'aussie-rules', 'ping-pong', 'bowls', 'esl', 'athletics', 'futsal', 'cross-country', 'moto-gp', 'beach-volleyball', 'special-bets', 'beach-soccer', 'triathlon', 'badminton', 'softball', 'rugby-league', 'speedway', 'netball', 'martial-arts', 'poker', 'speed-skating', 'motor-sports', 'pool', 'fantasy-league', 'shooting', 'archery', 'judo', 'taekwondo', 'canoe-kayak', 'trampoline', 'rhythmic', 'equitation', 'fencing', 'vault', 'uneven-bars', 'floor', 'balance-beam', 'diving', 'wrestling', 'bandy', 'floorball', 'pesapallo', 'squash', 'bobsleigh', 'figure-skating', 'luge', 'nordic-combined', 'short-track', 'skeleton', 'snowboarding', 'ceremonies-medals', 'lacrosse', 'gaelic-sports', 'fishing', 'x-games']
      }, {
        type: 'enumInfo',
        localName: 'TennisPeriodEnum',
        baseTypeInfo: 'Token',
        values: ['not started', 'set 1', 'set 2', 'set 3', 'set 4', 'set 5', 'walkover', 'retired', 'delayed', 'interrupted', 'ended']
      }, {
        type: 'enumInfo',
        localName: 'PasswordValidationTypeEnum',
        baseTypeInfo: 'Token',
        values: ['sms-sent', 'email-sent', 'authentication-code']
      }, {
        type: 'enumInfo',
        localName: 'SoccerPeriodEnum',
        baseTypeInfo: 'Token',
        values: ['not started', 'period 1', 'period 2', 'paused', 'overtime period 1', 'overtime period 2', 'penalty', 'interrupted', 'ended']
      }, {
        type: 'enumInfo',
        localName: 'AccountTypeEnum',
        baseTypeInfo: 'Token',
        values: ['sports-bets', 'casino', 'poker']
      }, {
        type: 'enumInfo',
        localName: 'TennisMatchFormatEnum',
        baseTypeInfo: 'Token',
        values: ['best-of-3', 'best-of-5']
      }, {
        type: 'enumInfo',
        localName: 'RegionsEnum',
        baseTypeInfo: 'Token',
        values: ['germany', 'italy', 'france', 'belgium', 'spain', 'netherlands', 'greece', 'great-britain', 'international', 'europe']
      }, {
        type: 'enumInfo',
        localName: 'BeachVolleyballPeriodEnum',
        baseTypeInfo: 'Token',
        values: ['not started', 'set 1', 'set 2', 'set 3', 'golden set', 'paused', 'walkover', 'retired', 'delayed', 'interrupted', 'ended']
      }, {
        type: 'enumInfo',
        localName: 'SortOrderEnum',
        baseTypeInfo: 'Token',
        values: ['ascending', 'descending']
      }, {
        type: 'enumInfo',
        localName: 'UserDomainEnum',
        baseTypeInfo: 'Token',
        values: ['online-regular', 'cashcard-user', 'cashcard-agent', 'loyalty-card']
      }, {
        type: 'enumInfo',
        localName: 'BasketballPeriodEnum',
        baseTypeInfo: 'Token',
        values: ['not started', 'quarter 1', 'quarter 2', 'quarter 3', 'quarter 4', 'paused', 'overtime', 'interrupted', 'ended']
      }, {
        type: 'enumInfo',
        localName: 'VolleyballPeriodEnum',
        baseTypeInfo: 'Token',
        values: ['not started', 'set 1', 'set 2', 'set 3', 'set 4', 'set 5', 'golden set', 'paused', 'walkover', 'retired', 'delayed', 'interrupted', 'ended']
      }, {
        type: 'enumInfo',
        localName: 'PasswordValidationType',
        baseTypeInfo: 'Token',
        values: ['sms-sent ', 'casino', 'poker']
      }, {
        type: 'enumInfo',
        localName: 'IceHockeyPeriodEnum',
        baseTypeInfo: 'Token',
        values: ['not started', 'period 1', 'period 2', 'period 3', 'paused', 'overtime', 'penalty', 'interrupted', 'ended']
      }, {
        type: 'enumInfo',
        localName: 'BetTypeEnum',
        baseTypeInfo: 'Token',
        values: ['outright', 'regular_1x2', 'regular_1_2', 'handicap_1x2', 'handicap_1_2', 'over_under', 'double_chance', 'halftime_fulltime', 'first_halftime', 'second_halftime', 'final_score', 'first_goal_time', 'last_goal_time', 'half_or_final', 'first_goal_team', 'last_goal_team', 'goals_odd_even', 'most_goals_halftime', 'goal_both_teams', 'head_to_head', 'first_half_score', 'both_halves_winner', 'special', 'kick_off', 'winner_rest', 'next_goal', 'halftime_winner_rest', 'halftime_over_under', 'next_goal_overtime', 'winner_rest_overtime', 'next_goal_penalty', 'winner_penalty', 'total_goals', 'exact_number_of_goals', 'first_half_exact_number_of_goals', 'first_half_goals_home', 'first_half_goals_away', 'when_will_next_goal_be_scored', 'highest_scoring_half', 'next_goal_first_half', 'which_team_wins_race_to_x_points_first_set', 'which_team_wins_race_to_x_points_second_set', 'which_team_wins_race_to_x_points_third_set', 'who_scores_xth_point_first_set', 'who_scores_xth_point_second_set', 'who_scores_xth_point_third_set', 'how_many_sets_exceeded_score_limit', 'over_under_for_first_set', 'odd_even_for_first_set', 'over_under_for_second_set', 'odd_even_for_second_set', 'over_under_for_third_set', 'odd_even_for_third_set', 'winner_of_match', 'winner_of_set', 'final_result_in_sets_best_of_3', 'number_of_sets_best_of_3', 'goal_team_1', 'goal_team_2', 'over_under_overtime', 'winner_of_Games_XY_of_set', 'final_result_best_of_5', 'number_of_sets_best_of_5', 'winner_of_period', 'total_period_4', 'total_period_overtime', 'odd_even_period_4', 'odd_even_period_halftime', 'draw_no_period_1', 'draw_no_period_2', 'draw_no_period_3', 'draw_no_period_4', 'draw_no_period_halftime', 'winner_with_overtime', 'winner_jump_ball', 'overtime', 'who_scores_x_points', 'winner_with_x_points', 'winner_of_first_set_best_of_3', 'winner_of_first_set_best_of_5', 'goal_team_home', 'goal_team_away', 'which_team_wins_race_to_x_points_fourth_set', 'which_team_wins_race_to_x_points_fifth_set', 'who_scores_xth_point_fourth_set', 'who_scores_xth_point_fifth_set', 'over_under_for_fifth_period', 'odd_even_for_fifth_period', 'first_half_overtime', 'overtime_1x2', 'regular_1x2_over_under', 'goal_both_teams_1st_half', 'goal_both_teams_2nd_half', 'regular_1x2_goal_both_teams']
      }, {
        type: 'enumInfo',
        localName: 'ParticipantEnum',
        baseTypeInfo: 'Token',
        values: ['home', 'away']
      }, {
        type: 'enumInfo',
        localName: 'Device',
        baseTypeInfo: 'Token',
        values: ['desktop', 'smartphone', 'tablet', 'smartphone_native', 'tablet_native']
      }, {
        type: 'enumInfo',
        localName: 'ErrorCodeEnum',
        baseTypeInfo: 'Token',
        values: ['system', 'system.masdown', 'system.illegal.argument', 'system.unknown.country', 'system.partner.walletws.not.reachable', 'system.partner.walletws.malformed.url', 'system.partner.login.required', 'system.partner.permission.required', 'system.entity.not.found', 'system.partner.external.wallets.not.supported', 'system.partner.deposit.target.wallet.not.supported', 'system.user.payment.deposit.not.allowed', 'login.banned', 'login.expired.or.invalid', 'login.failed', 'login.improper.licence', 'login.iovation.red', 'login.ip.address.missing.or.invalid', 'login.new', 'login.otherwise.logged.in', 'login.password.wrong', 'login.password.wrongblocked', 'login.password.reset.but.not.changed', 'login.player.is.excluded.from.play', 'login.self.limited', 'login.terms.not.accepted', 'login.unknown', 'login.user.enabled', 'login.user.sportsbets.notvisible', 'placecombination.general.error', 'placecombination.exposure.limit.exceeded', 'placecombination.limit.exceeded', 'placecombination.not.enough.bets', 'placecombination.odds.too.high', 'placecombination.odds.too.low', 'placecombination.not.permitted', 'placecombination.player.protection.max.stake.exceeded', 'placecombination.stake.too.high', 'placecombination.user.has.no.wallet', 'placecombination.user.not.enabled', 'placecombination.outcome.odds.not.available', 'placecombination.outcome.odds.changed', 'placecombination.outcome.not.open', 'placecombination.market.not.available', 'placecombination.event.bets.maximum', 'placecombination.market.bets.maximum', 'placecombination.slips.maximum', 'placecombination.stake.too.low', 'placecombination.market.not.open', 'placecombination.market.started', 'placecombination.missing.external.transaction.id', 'placecombination.user.currency.not.matched', 'bet-slip-details-request.place-date-from.before.allowed.date', 'registration.activation.email.not.sent', 'registration.activationcode.invalid', 'registration.duplicate.account', 'registration.expired', 'registration.general.error.activate.user', 'registration.general.error.create.user', 'registration.illegal.username.chars', 'registration.illegal.username.too.short', 'registration.illegal.username.too.long', 'registration.invalid.currency.country.combination', 'registration.unknown.currency', 'registration.improper.domain.access', 'registration.user.does.not.exist', 'registration.username.already.exist', 'registration.idsearch.mismatch', 'registration.invalid.domain.for.user.type', 'registration.timezone.invalid', 'registration.zipcode.invalid', 'registration.required.data.missing', 'contactExist.email', 'contact.email.address.invalid', 'contact.email.sending.failed', 'contact.invalid.format', 'contact.required.data.missing', 'contactExist.fax', 'contactExist.phone.home', 'contactExist.phone.mobile', 'contactExist.phone.office', 'contactExist.poker.client.email', 'contactExist.sms', 'login.failed.total.exceeded', 'profile-info.change-password.required.data.missing', 'password.too.short', 'password.too.long', 'password.same.as.username', 'password.contains.illegal.character', 'password.not.secure', 'status.unknown.external.transaction.id', 'status.duplicate.external.transaction.id', 'wallet-transaction-list-request.creation-date-from.before.allowed.date', 'wallet.transaction.description.translation.not.found', 'deposit.limit.exceeded.max', 'deposit.global.limit.exceeded.max', 'deposit.global.limit.below.min', 'deposit.user.currency.not.matched', 'deposit.return.url.missing.or.invalid', 'deposit.status.no.longer.available', 'email.invalid.format', 'phone.too.long', 'phone.invalid.format', 'mobile-phone.too.long', 'mobile-phone.invalid.format', 'registration.data.invalid', 'address.zip.code.not.allowed', 'address.zip.code.too.long', 'address.zip.code.required', 'address.city.not.allowed', 'address.city.too.long', 'address.city.required', 'address.country.not.allowed', 'address.country.too.long', 'address.country.required', 'address.street.name.not.allowed', 'address.street.name.too.long', 'address.street.name.required', 'address.house.number.not.allowed', 'address.house.number.too.long', 'address.house.number.required', 'address.name.not.allowed', 'address.name.too.long', 'address.name.required', 'address.first.name.not.allowed', 'address.first.name.too.long', 'address.first.name.required', 'address.house.name.not.allowed', 'address.house.name.too.long', 'address.house.name.required', 'address.house.extension.not.allowed', 'address.house.extension.too.long', 'address.house.extension.required', 'address.state.not.allowed', 'address.state.too.long', 'address.state.required', 'currency.information.not.available', 'partnercode.not.valid', 'user.profile.update.required.data.missing', 'user.profile.update.data.invalid', 'user.profile.update.general.error', 'user.profile.loyalty.card.not.supported', 'action.not.allowed.for.user.domain', 'email.in.blacklist', 'bonus.code.invalid', 'loyalty.card.not.found', 'loyalty.card.security.level.not.found', 'password.authentication.code.invalid', 'forgot.password.already.requested', 'deposit.limit.unverified.user']
      }],
    elementInfos: [{
        elementName: {
          localPart: 'error-detail',
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
        },
        typeInfo: '.ErrorDetail'
      }, {
        elementName: 'betting-program',
        typeInfo: '.BettingProgram'
      }, {
        elementName: {
          localPart: 'error-details',
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
        },
        typeInfo: '.ErrorDetails'
      }, {
        elementName: 'betting-program-translations',
        typeInfo: '.BettingProgramTranslations'
      }, {
        elementName: 'betting-program-last-modified',
        typeInfo: '.BettingProgramLastModified'
      }, {
        elementName: {
          localPart: 'error-response',
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
        },
        typeInfo: '.ErrorResponse'
      }, {
        elementName: {
          localPart: 'ok-response',
          namespaceURI: 'http:\/\/www.mybet.com\/b2b\/rest\/jaxb\/error'
        },
        typeInfo: '.OkResponse'
      }]
  };
  return {
    PO: PO
  };
};
if (typeof define === 'function' && define.amd) {
  define([], PO_Module_Factory);
}
else {
  var PO_Module = PO_Module_Factory();
  if (typeof module !== 'undefined' && module.exports) {
    module.exports.PO = PO_Module.PO;
  }
  else {
    var PO = PO_Module.PO;
  }
}