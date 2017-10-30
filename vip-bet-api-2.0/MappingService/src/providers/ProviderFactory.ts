/**
 * Created by   on 3/26/2017.
 */

import { LadBrokesProvider } from "./providers/LadBrokesProvider";
import { RedKingsProvider } from "./providers/RedKingsProvider";
import { IProvider } from "./IProvider";
import { MyBetProvider } from "./providers/MyBetProvider";
import { SBTechProvider } from "./providers/SBTechProvider";
import { WHillsProvider } from "./providers/WHillsProvider";
import { BetFairProvider } from "./providers/BetFairProvider";
import { BetWayProvider } from "./providers/BetWayProvider";
import { CoralProvider } from "./providers/CoralProvider";
import { PinnacleProvider } from "./providers/PinnacleProvider";
import { Bet365Provider } from "./providers/Bet365Provider";
import { BetSafeProvider } from "./providers/BetSafeProvider";
import { BWinProvider } from "./providers/BWinProvider";
import { Sports888Provider } from "./providers/Sport888Provider";
import { ProviderID } from "../../../parsers/BaseParser/src/ProviderID";
import { BetAtHomeProvider } from "./providers/BetAtHomeProvider";
import { IntertopsProvider } from "./providers/IntertopsProvider";
export class ProviderFactory {
    private static providers: any = {};
    public static getProvider(providerId: number): IProvider | undefined {
        if (ProviderFactory.providers[providerId]) return ProviderFactory.providers[providerId];
        switch (providerId) {
            case ProviderID.LAD_BROKES:
                ProviderFactory.providers[providerId] = new LadBrokesProvider();
                break;
            case ProviderID.RED_KINGS:
                ProviderFactory.providers[providerId] = new RedKingsProvider();
                break;
            case ProviderID.MY_BET:
                ProviderFactory.providers[providerId] = new MyBetProvider();
                break;
            case ProviderID.SB_TECH:
                ProviderFactory.providers[providerId] = new SBTechProvider();
                break;
            case ProviderID.WILLIAM_HILLS:
                ProviderFactory.providers[providerId] = new WHillsProvider();
                break;
            case ProviderID.BET_FAIR:
                ProviderFactory.providers[providerId] = new BetFairProvider();
                break;
            case ProviderID.BET_WAY:
                ProviderFactory.providers[providerId] = new BetWayProvider();
                break;
            case ProviderID.CORAL:
                ProviderFactory.providers[providerId] = new CoralProvider();
                break;
            case ProviderID.PINNACLE:
                ProviderFactory.providers[providerId] = new PinnacleProvider();
                break;
            case ProviderID.BET365:
                ProviderFactory.providers[providerId] = new Bet365Provider();
                break;
            case ProviderID.BET_SAFE:
                ProviderFactory.providers[providerId] = new BetSafeProvider();
                break;
            case ProviderID.BWIN:
                ProviderFactory.providers[providerId] = new BWinProvider();
                break;
            case ProviderID.SPORTS_888:
                ProviderFactory.providers[providerId] = new Sports888Provider();
                break;
            case ProviderID.BET_AT_HOME:
                ProviderFactory.providers[providerId] = new BetAtHomeProvider();
                break;
            case ProviderID.INTERTOPS:
                ProviderFactory.providers[providerId] = new IntertopsProvider();
                break;
        }
        if (ProviderFactory.providers[providerId]) return ProviderFactory.providers[providerId];
        return undefined;
    }
}