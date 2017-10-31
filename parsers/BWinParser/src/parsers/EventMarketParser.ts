/**
 * Created by   on 3/5/2017.
 */
import { ParserBase } from "../../../BaseParser/src/ParserBase";
import { IEventMarketService } from "../../../BaseParser/src/bll/abstract/IEventMarketService";
import { EventMarketService } from "../../../BaseParser/src/bll/services/EventMarketService";
import { EventStatus } from "../../../../CommonJS/src/domain/enums/event.status";
import { each } from "bluebird";
import { IBetFairEventMarket, Bwin, IBetFairSelection } from "../utils/bwin";
import { isArray, toNumber } from "lodash";
import { IFeedParticipant } from "../../../BaseParser/src/interfaces/IFeedParticipant";
import { similarity } from "../../../../CommonJS/src/utils/utils";

export class EventMarketParser extends ParserBase {
    private eventMarketService: IEventMarketService = new EventMarketService();

    async processRequest(market: IBetFairEventMarket) {
        // "Goal Scored 07:00 - 16:59"
        if (market.market_name.match(/([0-9]{0,2}:[0-9]{0,2} - [0-9]{0,2}:[0-9]{0,2}|[0-9]{0,2}:[0-9]{0,2})/g)) return;
        // if market is in play return;
        if (JSON.parse(market.in_play)) return;
        this.parseMarket(market);
        // exlude markets with X and Y arguments
        if ((market.market_type.match(/total/gi) || []).length > 1) return;
        if ((market.market_type.match(/match_&_total/gi) || []).length > 0) return;
        if ((market.market_type.match(/(scorer|to_score|SMACCAS|player|booked|time_of|interval|LIVE_TREBLES)/gi) || []).length > 0) return;
        // 
        const sportId = market.bf_sport_id;
        const eventId = market.bf_event_id;
        const marketType = market.market_type;
        const id = market.bf_market_id;
        const status = market.status === "OPEN" ? EventStatus.ACTIVE : EventStatus.SUSPENDED;
        // get market selections
        let selections = await Bwin.getMarketSelections(market.sp_market_id);
        // check if responce is array
        if (!isArray(selections)) return;
        // replace participant names in selection names
        selections = this.parseSelections(selections, market.participants);
        // console.log(market.market_type, market.handicap)
        // add event market
        await this.eventMarketService.addEventMarket(id, marketType, status, eventId, marketType, sportId, marketType);
        // process event market selections
        return each(selections, async selection => {
            if (ParserBase.stopped) return;
            selection.bf_market_id = id;
            selection.bf_sport_id = sportId;
            selection.market_type = marketType;
            selection.participants = market.participants;
            selection.handicap = selection.handicap !== "0.0" ? selection.handicap : market.handicap;
            return this.successor.processRequest(selection).catch(err => {
                console.log("EventMarketOutcomeParser Error: ");
                console.log(err);
            });
        });
    }

    private parseSelections(selections: IBetFairSelection[], participants: IFeedParticipant[]): IBetFairSelection[] {
        return selections.map(selection => {
            selection.selection_name = selection.selection_name.replace(/ \/ /g, "/")
            participants.map(participant => {
                selection.selection_name = selection.selection_name.replace(new RegExp(participant.name, "g"), participant.type);
            })
            selection.selection_name = this.checkForParticipantNamesReplace(selection.selection_name, "/", participants);
            selection.selection_name = this.checkForParticipantNamesReplace(selection.selection_name, " and ", participants);
            selection.selection_name = this.checkForParticipantNamesReplace(selection.selection_name, " or ", participants);
            selection.selection_name = this.checkForParticipantNamesReplace(selection.selection_name, " at ", participants);
            return selection;
        })
    }

    private checkForParticipantNamesReplace(name: string, delimiter: string, participants: IFeedParticipant[]): string {
        const splits = name.split(delimiter);
        if (splits.length == 2) {
            return splits.map(splitted => {
                participants.map(participant => {
                    if (similarity(splitted, participant.name) > 0.6) {
                        splitted = participant.type;
                    }
                })
                return splitted;
            }).join(delimiter);
        }
        return name;
    }

    private async parseMarket(market: IBetFairEventMarket) {
        if ((market.market_type.match(/_([0-9]{1,3}.[0-9]{1,3})/g) || []).length > 0) {
            // HOME_TEAM_FIRST_HALF_O/U_1.5_GOALS
            const argumentString = (market.market_type.match(/_([0-9]{1,3}.[0-9]{1,3})/g) || [])[0];
            market.handicap = argumentString.replace(/_/g, "");
            market.market_type = market.market_type.replace(argumentString, "");
        } else if ((market.market_type.match(/^GOAL_|[0-9]{1,3}$/g) || []).length === 2) {
            // GOAL_O1
            const argumentString = (market.market_type.match(/_[0-9]{1,3}$/g) || [])[0];
            market.market_type = market.market_type.replace(argumentString, "");
            market.handicap = toNumber(argumentString.replace(/_/g, "")).toString();
        } else if ((market.market_type.match(/^RACE_TO_[0-9]{1,3}_CORNER/g) || []).length > 0) {
            // RACE_TO_X_CORNERS
            const argumentString = (market.market_type.match(/_[0-9]{1,3}_/g) || [])[0];
            market.market_type = "RACE_TO_X_CORNER";
            market.handicap = toNumber(argumentString.replace(/_/g, "")).toString();
        } else if ((market.market_type.match(/_([0-9]{1,3}[0-9]$)/g) || []).length > 0) {
            // HOME_TEAM_FIRST_HALF_O/U_15
            const argumentString = (market.market_type.match(/_([0-9]{1,3}[0-9]$)/g) || [])[0];
            market.handicap = argumentString.replace(/_/g, "");
            market.handicap = market.handicap.substr(0, market.handicap.length - 1) + "." + market.handicap.substr(market.handicap.length - 1);
            market.market_type = market.market_type.replace(argumentString, "");
        } else if ((market.market_name.match(/( [0-9]{1,3}\+ )/g) || []).length > 0) {
            // score 4+ goals
            const argumentString = (market.market_name.match(/( [0-9]{1,3}\+ )/g) || [])[0];
            market.handicap = argumentString.replace(/ /g, "").replace(/\+/g, "");
        }
    }
}