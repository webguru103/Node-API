/**
 * Created by   on 3/5/2017.
 */
import { HTTPUtil } from "../../utils/httpUtil";
import { URLFactory } from "../../utils/urlFactory";
import { ParserBase } from "../../../../BaseParser/src/ParserBase";
import { EventParser } from "./EventParser";
import { EventMarketParser } from "./EventMarketParser";
import { EventMarketOutcomeParser } from "./EventMarketOutcomeParser";
import { SportCountryParser } from "./SportCountryParser";
import { LeagueParser } from "./LeagueParser";
import { SportParser } from "./SportParser";
import { TranslationUtil } from "../../utils/TranslationUtil";
import { LanguageType } from "../../utils/LanguageType";
import { BetTypeUtil } from "../../utils/BetTypeUtil";
import { each } from "bluebird";

export class MainBookParser extends ParserBase {
    constructor() {
        super();

        this.setSuccessor(new SportParser())
            .setSuccessor(new SportCountryParser())
            .setSuccessor(new LeagueParser())
            .setSuccessor(new EventParser())
            .setSuccessor(new EventMarketParser())
            .setSuccessor(new EventMarketOutcomeParser());
    }

    async processRequest(d?) {
        let reqObj = URLFactory.getRequest("https://b2bproxy.mybet.com/b2b-api/v2/rest/betting-program/main/entire");

        await TranslationUtil.loadTranslation(LanguageType.en);
        let data = await HTTPUtil.scheduleGetData(reqObj);
        if (!data) {
            ParserBase.parsing = false;
            return;
        };
        data = data['betting-program'];

        if (ParserBase.stopped) return;
        //parse bet types for faster access later in market parsing
        await each(data['bet-type'], betType => {
            if (ParserBase.stopped) return;
            betType['$']['translation'] = TranslationUtil.getTranslation(betType['$']['translation-id'], LanguageType.en);
            BetTypeUtil.betTypes[betType['$'].name] = betType['$'];
        });

        if (ParserBase.stopped) return;
        //parse outcome types for faster access later in selection parsing
        await each(data['outcome-type'], outcome => {
            if (ParserBase.stopped) return;
            outcome['$']['translation'] = TranslationUtil.getTranslation(outcome['$']['translation-id'], LanguageType.en);
            BetTypeUtil.outcomeTypes[outcome['$'].name] = outcome['$'];
        });

        await this.successor.processRequest(data);
        this.destroy();
        // ParserBase.parsing = false;
        this.start();
        console.log("data parsing finished");
    }

    public async stop() {
        super.stop();
        this.destroy();
    }

    private destroy() {
        TranslationUtil.destroyTranslations();
        ParserBase.countries = {};
        BetTypeUtil.betTypes = {};
        BetTypeUtil.outcomeTypes = {};
    }
}