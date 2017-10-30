import { toNumber } from "lodash";
import { IMarket } from "./ladbrokes";

let majorCodeToName = {
    "-": "Standard fixed-odds market",
    "A": "Asian Handicap",
    "C": "Correct score/first scorer",
    "H": "Straight handicap",
    "L": "Higher/lower",
    "l": "Higher/lower with split line",
    "M": "Handicap with betting on the line allowed",
    "N": "Continuous win",
    "P": "Points market",
    "R": "Range market",
    "W": "Winning margin"
}
let minorCodeToName = {
    "SS,-": "To Win",
    "1W,H": "1st Half Western Handicap",
    "2W,H": "2nd Half Western Handicap",
    "1H,L": "1st Half Higher/Lower",
    "2H,L": "2nd Half Higher/Lower",
    "A2,A": "Asian Handicap half-time betting",
    "AG,-": "Anytime Scorer",
    "AH,A": "Asian Handicap",
    "AH1,A": "Asian Handicap 1st Half",
    "B3,-": "Bookings 3-Band",
    "BO,-": "Both/One/Neither Team to Score",
    "BX,-": "Bookings 10-Band",
    "C1,-": "First Corner",
    "C3,-": "Corners 3-Band",
    "CI,-": "Competitor Incident Matrix",
    "CP,N": "Runs in next cricket partnership",
    "CS,-": "Correct Score",
    "cs,-": "Correct Score in the first half",
    "CW,N": "Continuous Win (Next scorer)",
    "CX,-": "Corners 10-Band",
    "DN,-": "Draw No Bet",
    "DC,-": "Double Chance",
    "FS,-": "First scorer",
    "G3,-": "Goals 3-Band",
    "GC,-": "Goal crazy",
    "GG,-": "Goal/No-Goal",
    "GT,-": "Time of first home/away/match goal",
    "GX,-": "Goals 10-Band",
    "HC,-": "Handicap",
    "HT,-": "Half-time",
    "H1,-": "1st half result",
    "H2,-": "2nd half result",
    "HF,-": "Half-time/full-time",
    "HF5,-": "Half-time/full-time with any other result",
    "HF6,-": "Half-time/full-time without full time draws",
    "HG,-": "Half with More Goals",
    "HA,L": "Away Team Higher/Lower (slot)",
    "HH,L": "Home Team Higher/Lower (slot)",
    "HH,-": "Head to Head (on a draw both home+away win with 50% DH redn)",
    "1HH,-": "First Half Head to Head",
    "2HH,-": "Second Half Head to Head",
    "HL,L": "Higher/Lower",
    "hl,l": "Higher/Lower with split line",
    "LG,-": "Last team to score",
    "LS,-": "Last scorer",
    "MA,-": "3 way betting (match)",
    "MH,M": "Match Handicap (same as WH but you can bet on the line)",
    "ML,-": "Moneyline",
    "MR,-": "Match result (W/D/W)",
    "NG,N": "Next team to score",
    "NM N": "Next Scorer (Match)",
    "NO N": "Runs in next over",
    "NP N": "Next Penality",
    "OE,-": "Odd/Even",
    "OU,U": "Over/Under (SLOT betting)",
    "P2,-": "Place Only – 2nd place",
    "P3,-": "Place Only – 3rd place",
    "P4,-": "Place Only – 4th place",
    "P5,-": "Place Only – 5th place",
    "P6,-": "Place Only – 6th place",
    "PM,P": "Points Market",
    "QR,-": "Quattro",
    "Q1,-": "1st Quarter Result",
    "Q2,-": "2nd Quarter Result",
    "Q3,-": "3rd Quarter Result",
    "Q4,-": "4th Quarter Result",
    "R2,-": "Race To X (eg Race to 3 Runs baseball)",
    "SC,C": "Scorecast",
    "LC,C": "Last scorecast",
    "AC,C": "Anytime scorecast",
    "FW,C": "First wincast",
    "LW,C": "Last wincast",
    "AW,C": "Anytime wincast",
    "SF,-": "Side to score first",
    // "SS": "Correct Score Special",
    "SW,C": "Showcast",
    "TA,N": "Time of next away goal",
    "TG,-": "Total goals",
    "TH,N": "Time of next home goal",
    "TM,N": "Time of next match goal",
    "TS,R": "Total Score (HL with multiple ranges)",
    "TT,-": "Total Team Goals",
    "WI,-": "Win-only",
    "WH,H": "Western (US-style) Handicap",
    "WM,-": "Winning Margin",
    "WMO,W": "Winning Margin without Draw",
    "WO,-": "Without the favourite",
    "W1,-": "Win 1st half-time, quarter, set, etc.",
    "W2,-": "Win 2nd half-time, quarter, set, etc.",
    "W3,-": "Win 3rd half-time, quarter, set, etc.",
    "W4,-": "Win 4th half-time, quarter, set, etc.",
    "W5,-": "Win 5th half-time, quarter, set, etc.",
    "W6,-": "Win 6th half-time, quarter, set, etc.",
    "W7,-": "Win 7th half-time, quarter, set, etc.",
    "W8,-": "Win 8th half-time, quarter, set, etc.",
    "W9,-": "Win 9th half-time, quarter, set, etc.",
    "WS,-": "To Win (by competitors' scores)"
}

export function marketMinorNameFactory(minorCode: string, majorCode: string) {
    return minorCodeToName[minorCode + "," + majorCode];
}

export function marketMajorNameFactory(majorCode: string) {
    return majorCodeToName[majorCode];
}

let marketNamesNonRecognized: string[] = [
    "Spread and Total Points Double"
    // 'Total Number of Goals',
    // 'Under/Over',
    // '1st Half Winning Margin',
    // '2nd Half Winning Margin',
    // '3rd Half Winning Margin',
    // '1st Quarter Winning Margin',
    // '2nd Quarter Winning Margin',
    // '3rd Quarter Winning Margin',
    // 'Winning margin',
    // 'Home Total Goals',
    // 'Away Total Goals',
    // '1st Period Total Goals',
    // '2nd Period Total Goals',
    // '3rd Period Total Goals',
    // 'Highest Scoring Period',
    // '60 Minutes Winning Margin',
    // 'Will There Be Overtime?',
    // 'Total Goals '
]
export function parseMarketName(marketName: string) {
    if (marketNamesNonRecognized.includes(marketName)) return marketName;
    return;
}

export function parseMarket(market: IMarket): void {

    market.marketName = market.marketName.replace(regExp(market.participants[0].name), "Home");
    market.marketName = market.marketName.replace(regExp(market.participants[1].name), "Away");

    let name = market.marketName;
    let argument: number = NaN;
    let tempName: string = name;
    if (name.indexOf("Match Result and Over/Under ") != -1) {
        name = "Match Result and Over/Under";
        argument = Number(tempName.split("Match Result and Over/Under ")[1].split(" ")[0]);
    }
    if (name.indexOf(" Overs.") != -1) {
        name = tempName.split(" Overs.")[0] + " Overs";
    }
    if (name.indexOf("Both Teams to Score and Over/Under ") != -1) {
        name = "Both Teams to Score and Over/Under";
        argument = Number(tempName.split("Both Teams to Score and Over/Under ")[1].split(" ")[0]);
    }
    if (name.indexOf(" Total Goals ") != -1) {
        name = name.substring(0, name.indexOf(" Total Goals")) + " Total Goals";
        argument = Number(tempName.split("Total Goals ")[1]);
    }

    if (name.indexOf("Over/Under Second Half ") != -1) {
        name = "Over/Under Second Half";
        argument = Number(tempName.split("Over/Under Second Half ")[1]);
    }
    if (name.indexOf("Over/Under First Half ") != -1) {
        name = "Over/Under First Half";
        argument = Number(tempName.split("Over/Under First Half ")[1]);
    }
    if (name.indexOf("Away to Score ") != -1 && name.indexOf("+ Goals") != -1) {
        name = "Away to Score X+ Goals";
        argument = Number(tempName.substring("Away to Score ".length, tempName.indexOf("+ Goals")));
    }

    if (name.indexOf("Home to Score ") != -1 && name.indexOf("+ Goals") != -1) {
        name = "Home to Score X+ Goals";
        argument = Number(tempName.substring("Home to Score ".length, tempName.indexOf("+ Goals")));
    }

    if (name.indexOf("Next Team To Score Goal") != -1) {
        name = "Next Team To Score Goal X";
        argument = Number(tempName.split("Next Team To Score Goal ")[1]);
    }

    if (name.indexOf("Half Time Result and Over/Under ") != -1) {
        name = "Half Time Result and Over/Under";
        argument = Number(tempName.split("Half Time Result and Over/Under ")[1]);
    }

    if (name.indexOf("Total runs ") == 0 && name.length <= "Total runs ".length + 6) {
        name = "Runs Total";
        argument = Number(tempName.split("Total runs ")[1]);
    }

    if (name.indexOf("Away Total runs ") == 0 && name.length <= "Away Total runs ".length + 6) {
        name = "Away Runs Total";
        argument = Number(tempName.split("Away Total runs ")[1]);
    }

    if (name.indexOf("Home Total runs ") == 0 && name.length <= "Home Total runs ".length + 6) {
        name = "Home Runs Total";
        argument = Number(tempName.split("Home Total runs ")[1]);
    }

    if (name.indexOf(" Innings Handicap ") != -1) {
        name = tempName.split(" Innings Handicap ")[0] + " Innings Handicap X";
        argument = Number(tempName.split(" Innings Handicap ")[1]);
    }

    if (name.indexOf("Run Line ") == 0 && name.length <= "Run Line ".length + 6) {
        name = "Run Line ";
        argument = Number(tempName.split("Run Line ")[1]);
    }

    if (name.indexOf(" Innings Handicap With Tie ") != -1) {
        name = tempName.split(" Innings Handicap With Tie ")[0] + " Innings Handicap With Tie X";
        argument = Number(tempName.split(" Innings Handicap With Tie ")[1]);
    }

    if (name.indexOf(" Innings Run Line ") != -1) {
        name = tempName.split(" Innings Run Line ")[0] + " Innings Run Line X";
        argument = Number(tempName.split(" Innings Run Line ")[1]);
    }

    if (name.indexOf("Race to ") == 0 && name.indexOf(" Runs") != -1) {
        name = "Race to X Runs";
        argument = Number(tempName.split("Race To ")[1].split(" Run")[0]);
    }

    if (name.indexOf(" Innings Total Runs ") != -1) {
        name = tempName.split(" Innings Total Runs ")[0] + " Innings Total Runs X";
        argument = Number(tempName.split(" Innings Total Runs ")[1]);
    }

    if (name.indexOf(" Innings Total Runs Over/Under ") != -1) {
        name = tempName.split(" Innings Total Runs Over/Under ")[0] + " Innings Total Runs Over/Under X";
        argument = Number(tempName.split(" Innings Total Runs Over/Under ")[1]);
    }

    if (name.indexOf("Handicap First Half - Home ") == 0) {
        name = "Handicap First Half - Home X goals";
        argument = Number(tempName.split("Handicap First Half - Home ")[1].split(" goal"));
    }

    if (name.indexOf("Handicap First Half - Away ") == 0) {
        name = "Handicap First Half - Away X goals";
        argument = Number(tempName.split("Handicap First Half - Away ")[1].split(" goal"));
    }

    if (name.indexOf("Handicap Second Half - Home ") == 0) {
        name = "Handicap Second Half - Home X goals";
        argument = Number(tempName.split("Handicap Second Half - Home ")[1].split(" goal"));
    }

    if (name.indexOf("Handicap Second Half - Away ") == 0) {
        name = "Handicap Second Half - Away X goals";
        argument = Number(tempName.split("Handicap Second Half - Away ")[1].split(" goal"));
    }

    if (name.indexOf("Handicap Match Result - Home ") == 0) {
        name = "Handicap Match Result - Home X goals";
        argument = Number(tempName.split("Handicap Match Result - Home ")[1].split(" goal"));
    }

    if (name.indexOf("Handicap Match Result - Away ") == 0) {
        name = "Handicap Match Result - Away X goals";
        argument = Number(tempName.split("Handicap Match Result - Away ")[1].split(" goal"));
    }

    if ((name.indexOf("Away Total Points ") === 0 || name.indexOf("Home Total Points ") === 0) && (name.match(/[\s\S]([-]+?)[0-9]/g) || []).length > 0) {
        name = "Team Total Points Exact";
        argument = Number(tempName.split("Total Points ")[1]);
    } else if (name.indexOf("Total Points ") === 0 && (name.match(/[\s\S]([-]+?)[0-9]/g) || []).length > 0) {
        name = "Total Points Exact";
        argument = Number(tempName.split("Total Points ")[1]);
    } else if (name.indexOf("Away Total Points ") === 0 || name.indexOf("Home Total Points ") === 0) {
        name = "Team Total Points";
        argument = Number(tempName.split("Total Points ")[1]);
    }

    if (name.indexOf("60 Minutes Handicap ") == 0) {
        name = "60 Minutes Handicap ";
        argument = toNumber(tempName.split("60 Minutes Handicap ")[1]);
    }

    market.marketName = name;

    let marketArgument = market.handicapValue || market.rawHandicapValue;
    if (!marketArgument) marketArgument = argument || 0;
    market.handicapValue = marketArgument;

    if (marketArgument) {
        market.marketName = market.marketName.replace(new RegExp(marketArgument.toString(), 'g'), "");
        market.marketName = market.marketName.replace("+.0", "");
        market.marketName = market.marketName.replace(".0", "");
    }
}

export function regExp(toFind: string): RegExp {
    toFind = toFind.replace(new RegExp("\\(", "g"), "\\(");
    toFind = toFind.replace(new RegExp("\\)", "g"), "\\)");

    return new RegExp(toFind, "ig");
}