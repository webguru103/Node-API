import { ISelection } from "./ladbrokes";
import { regExp } from "./market.util";

let majorCodeToName = {
    "SS,-": "Standard Win Market",
    "SS,1": "Home",
    "SS,2": "Away",
    "SS,N": "Non-runner",
    "SS,R": "Reverse",
    "SS,W": "Withdraw Runner",
    "SS,V": "Vacant Trap",
    "SS,X": "Bet Without",
    "CS,S": "Correct score",
    "CS,O": "Other Result",
    "MR,H": "Home",
    "MR,D": "Draw",
    "MR,A": "Away",
    "HF,1": "Home/Home",
    "HF,2": "Home/Draw",
    "HF,3": "Home/Away",
    "HF,4": "Draw/Home",
    "HF,5": "Draw/Draw",
    "HF,6": "Draw/Away",
    "HF,7": "Away/Home",
    "HF,8": "Away/Draw",
    "HF,9": "Away/Away",
    "HF5,1": "Home/Home",
    "HF5,2": "Home/Away",
    "HF5,3": "Any Other Result",
    "HF5,4": "Away/Home",
    "HF5,5": "Away/Away",
    "HF6,1": "Home/Home",
    "HF6,2": "Home/Away",
    "HF6,3": "Draw/Home",
    "HF6,4": "Draw/Away",
    "HF6,5": "Away/Home",
    "HF6,6": "Away/Away",
    "FS,H": "Scorer on home team",
    "FS,A": "Scorer on away team",
    "FS,N": "No score",
    "LS,H": "Scorer on home team",
    "LS,A": "Scorer on away team",
    "LS,N": "No score",
    "AH,H": "Home",
    "AH,A": "Away",
    "WH,H": "Home",
    "WH,A": "Away",
    "MH,H": "Home",
    "MH,A": "Away",
    "MH,L": "On the line",
    "HL,H": "Higher",
    "HL,L": "Lower",
    "OU,O": "Over",
    "OU,U": "Under",
    "OU,H": "Over (Home)",
    "OU,A": "Over (Away)",
    "OU,h": "Under (Home)",
    "OU,a": "Under (Away)",
    "TG,1": "0-1",
    "TG,2": "2-3",
    "TG,3": "4-6",
    "TG,4": "7+",
    "TS,S": "Score",
    "OE,1": "Odd",
    "OE,2": "Even",
    "SF,H": "Home",
    "SF,A": "Away",
    "SF,D": "Draw",
    "H1,H": "Home",
    "H1,A": "Away",
    "H1,D": "Draw",
    "H2,H": "Home",
    "H2,A": "Away",
    "H2,D": "Draw"
}

export function outcomeMajorNameFactory(majorCode: string) {
    return majorCodeToName[majorCode];
}

export function parseSelection(selection: ISelection): any {
    selection.selectionName = selection.selectionName.toString();
    selection.selectionName = selection.selectionName.replace(/ \/ /g, "/");
    selection.selectionName = replaceSelectionName(selection.participants[0].name, selection.selectionName, "Home", selection.argument);
    selection.selectionName = replaceSelectionName(selection.participants[1].name, selection.selectionName, "Away", selection.argument);

    selection.selectionName = getSelectionNameByMarketMajorCode(
        selection.marketMeaningMajorCode,
        selection.marketMeaningMinorCode,
        selection.outcomeMeaningMajorCode,
        selection.outcomeMeaningMinorCode) || selection.selectionName;

    let name = selection.selectionName;
    let marketType = selection.marketName;

    let argument: any;
    let tempName: string = name;

    if ((marketType.indexOf("Corners U/O") != -1 || marketType.indexOf("Corners O/U") != -1)) {
        name = tempName.split(" ")[0];
        argument = Number(tempName.split(" ")[1]);
    }
    else if (marketType.indexOf("Team Total Points Exact") != -1 || marketType.indexOf("Total Points Exact") != -1) {
        name = tempName.split(" ")[0];
        if (tempName.match(/([0-9]{1,10} - [0-9]{1,10})/g)) name = "exact";
        argument = Number(tempName.split(" ")[1]);
        if (isNaN(argument)) argument = tempName;
    }
    else if (marketType.indexOf("Winning margin.") != -1 || marketType.indexOf("Winning margin") != -1) {
        name = tempName.split(" ")[0];
        argument = Number(tempName.split(" ")[1]);
        if (isNaN(argument)) argument = tempName.split(" ")[1];
    }
    else if (marketType.indexOf("Team Total Points Exact") != -1 || marketType.indexOf("Total Points Exact") != -1) {
        name = tempName.split(" ")[0];
        argument = Number(tempName.split(" ")[1]);
        if (isNaN(argument)) argument = tempName;
    } else if (marketType.indexOf("Correct score") != -1) {
        name = (tempName.match(/([0-9]{1,10})/g) || []).join(":");
    }
    if (argument && !selection.argument) selection.argument = argument;
    selection.selectionName = name;
}

export function getSelectionNameByMarketMajorCode(marketMeaningMajorCode: string, marketMeaningMinorCode: string, outcomeMeaningMajorCode: string, outcomeMeaningMinorCode: string): string {
    if (marketMeaningMajorCode == "H" && marketMeaningMinorCode == "WH") {
        if (outcomeMeaningMajorCode == "H") return "Home";
        if (outcomeMeaningMajorCode == "A") return "Away";
    }

    if (marketMeaningMajorCode == "M" && marketMeaningMinorCode == "MH") {
        if (outcomeMeaningMajorCode == "MH" && outcomeMeaningMinorCode == "H") return "Home";
        if (outcomeMeaningMajorCode == "MH" && outcomeMeaningMinorCode == "L") return "Draw";
        if (outcomeMeaningMajorCode == "MH" && outcomeMeaningMinorCode == "A") return "Away";
    }

    if (marketMeaningMinorCode == "HH"
        || marketMeaningMinorCode == "MR"
        || marketMeaningMinorCode == "H1"
        || marketMeaningMinorCode == "H2"
        || marketMeaningMinorCode == "LM"
        || marketMeaningMinorCode == "HL"
        || marketMeaningMinorCode == "DN") {
        if (outcomeMeaningMinorCode == "H") return "Home";
        if (outcomeMeaningMinorCode == "D") return "Draw";
        if (outcomeMeaningMinorCode == "A") return "Away";
    }

    if (marketMeaningMajorCode == "L" && marketMeaningMinorCode == "HL") {
        if (outcomeMeaningMajorCode == "HL" && outcomeMeaningMinorCode == "H") return "Over";
        if (outcomeMeaningMajorCode == "HL" && outcomeMeaningMinorCode == "L") return "Under";
    }

    if (marketMeaningMajorCode == "-" && marketMeaningMinorCode == "DC") {
        if (outcomeMeaningMajorCode == "DC" && outcomeMeaningMinorCode == "1") return "1X";
        if (outcomeMeaningMajorCode == "DC" && outcomeMeaningMinorCode == "2") return "X2";
        if (outcomeMeaningMajorCode == "DC" && outcomeMeaningMinorCode == "3") return "12";
    }
    return "";
}

function replaceSelectionName(teamName: string, selectionName: string, replaceWith: string, argument: number | undefined) {
    selectionName = selectionName.toString();
    let newName = selectionName;
    if (selectionName && ["under", "over", "odd", "even"].indexOf(selectionName.toLowerCase()) != -1) {
        return newName;
    }

    newName = newName.replace(regExp(teamName), replaceWith);
    if (argument) {
        newName = newName.replace(new RegExp(" " + argument.toString(), 'gi'), "");
        newName = newName.replace(new RegExp(" +" + argument.toString(), 'gi'), "");
        newName = newName.replace(".0", "");
    }
    return newName;
}