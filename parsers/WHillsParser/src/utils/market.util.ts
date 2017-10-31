export function parseMarket(name: string): any {
    let argument: number = NaN;
    let tempName: string = name;
    if (name.indexOf(" Over/Under ") != -1 && name.indexOf(" Goals")! - 1) {
        name = tempName.substr(0, tempName.search(" Over/Under ") + " Over/Under".length) + " Goals";
        argument = Number(Number(tempName.split(" Over/Under ")[1].split(" Goal")[0]));
    }
    if (name.indexOf("Under/Over ") != -1 && name.indexOf(" Goals")! - 1) {
        name = tempName.substr(0, tempName.search("Under/Over") + "Under/Over".length) + " Goals";
        argument = Number(Number(tempName.split("Under/Over ")[1].split(" Goal")[0]));
    }
    if (name.indexOf(" Handicap ") != -1 && name.indexOf(" Goal")! - 1) {
        name = tempName.substr(0, tempName.search(" Handicap") + " Handicap".length) + " Goal";
        argument = Number(Number(tempName.split(" Handicap ")[1].split(" Goal")[0]));
    }
    if (name.indexOf(" Total Points ") != -1 && name.indexOf(" Goal")! - 1) {
        name = tempName.substr(0, tempName.search(" Total Points") + " Total Points".length);
        argument = Number(Number(tempName.split(" Total Points ")[1].split(" Goal")[0]));
    }
    if (name.indexOf(" 1X2 ") != -1 && name.indexOf(" U/O ")! - 1) {
        name = tempName.substr(0, tempName.search(" U/O ") + " U/O ".length);
        argument = Number(tempName.split(" U/O ")[1]);
    }
    if (name.indexOf("Segna Goal Ospite ") != -1 && name.indexOf(" Tempo")! - 1) {
        name = "Segna Goal Ospite x Tempo";
        argument = Number(tempName.split("Segna Goal Ospite ")[1].split(" Tempo")[0]);
    }
    if (name.indexOf("Segna Goal Casa ") != -1 && name.indexOf(" Tempo")! - 1) {
        name = "Segna Goal Casa x Tempo";
        argument = Number(tempName.split("Segna Goal Casa ")[1].split(" Tempo")[0]);
    }
    if (name.indexOf("Race To ") != -1 && name.indexOf(" Goal")! - 1) {
        name = "Race To x Goal";
        argument = Number(tempName.split("Race To ")[1].split(" Goal")[0]);
    }
    if (name.indexOf(" Goal") != -1 && name.length < 10) {
        name = "xth Goal";
        let tn = tempName.split(" Goal")[0];
        argument = Number(tn.substring(0, tn.length - 2));
        if (isNaN(argument)) name = tempName;
    }
    if (name.indexOf("Total Corners ") != -1) {
        name = tempName.substr(0, tempName.search("Total Corners ") + "Total Corners ".length) + "x";
        argument = Number(tempName.split("Total Corners ")[1]);
    }
    if (name.indexOf(" Or More") != - 1) {
        let ar = tempName.substring(0, tempName.search(" Or More")).split(" ");
        argument = Number(ar[ar.length - 1]);
        name = tempName.substring(0, tempName.search(argument.toString())) + "x+" + tempName.split("Or More")[1];
    }
    if (name.indexOf("Total Goals ") != -1) {
        if (name.indexOf("Under/Exactly/Over ") != -1) {
            name = "Total Goals Exactly";
            argument = Number(tempName.split("Under/Exactly/Over ")[1]);
        } else {
            name = tempName.substr(0, tempName.search("Total Goals ") + "Total Goals ".length) + "x";
            argument = Number(tempName.split("Total Goals ")[1]);
        }
    }
    if (name.indexOf(" Point Winning") != -1) {
        argument = Number(tempName.split(" Point Winning")[0].split(" ")[1]);
        name = tempName.substring(0, tempName.search(argument.toString())) + " x " + "Point Winning" + tempName.split(" Point Winning")[1];
    }
    return { name: name, argument: argument };
}

export function parseSelection(name: string, marketType: string): any {
    let argument: number = NaN;
    let tempName: string = name;

    if (name.indexOf("Win and Over ") != -1 && name.indexOf(" Goal") != -1) {
        name = name.split("Win and Over")[0] + "Win and Over";
        argument = Number(tempName.split(" Win and Over ")[1].split(" Goal")[0]);
    }

    if (name.indexOf("Win and Under ") != -1 && name.indexOf(" Goal") != -1) {
        name = name.split("Win and Under")[0] + "Win and Under";
        argument = Number(tempName.split(" Win and Under ")[1].split(" Goal")[0]);
    }

    if (name.indexOf("Draw and Over ") != -1 && name.indexOf(" Goal") != -1) {
        name = name.split("Draw and Over ")[0] + "Draw and Over";
        argument = Number(tempName.split("Draw and Over")[1].split(" Goal")[0]);
    }

    if (name.indexOf("Draw and Under ") != -1 && name.indexOf(" Goal") != -1) {
        name = name.split("Draw and Under ")[0] + "Draw and Under";
        argument = Number(tempName.split("Draw and Under")[1].split(" Goal")[0]);
    }

    if (name.indexOf("Home ") != -1 && name.indexOf(" points") != -1 && name.indexOf(" or more") == -1) {
        name = "Home";
        argument = Number(tempName.split("Home ")[1].split(" point")[0]);
    }

    if (name.indexOf("Away ") != -1 && name.indexOf(" points") != -1 && name.indexOf(" or more") == -1) {
        name = "Away";
        argument = Number(tempName.split("Away ")[1].split(" point")[0]);
    }

    if (name.indexOf("Tie - ") != -1) {
        name = "Tie";
    }

    if (name.indexOf(" + goal") != -1) {
        name = name.split(" + goal")[0];
    }

    if (name.indexOf(" - goal") != -1) {
        name = name.split(" - goal")[0];
    }

    if (name.indexOf("Away ") != -1 && name.indexOf(" goal") != -1) {
        name = "Away"
        argument = Number(tempName.split("Away ")[1].split(" goal")[0]);
    }
    if (name.indexOf("Home ") != -1 && name.indexOf(" goal") != -1) {
        name = "Home"
        argument = Number(tempName.split("Home ")[1].split(" goal")[0]);
    }
    if ((name.indexOf("Under ") != -1 || name.indexOf("Over ") != -1)
        && (marketType.indexOf("Total Booking Points") != -1 || name.indexOf("Total Home Cards") || name.indexOf("Total Away Cards"))) {
        name = name.split(" ")[0];
        argument = Number(tempName.split(" ")[1]);
    }
    return { name: name, argument: argument };
}