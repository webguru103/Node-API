import * as cronParse from "cron-parser";

export function CleanObject(obj) {
    delete obj.user;
    for (var propName in obj) {
        if (obj[propName] === undefined) {
            delete obj[propName];
        }
    }
}



export const NormalizeOffset = (offset?: number) => (offset === undefined || offset < 0) ? 0 : offset;
export const NormalizeLimit = (limit?: number) => (limit === undefined || limit < 0) ? 10 : limit > 100 ? 100 : limit;
export const NormalizePage = (page?: number) => (page === undefined || page < 0) ? 0 : page;
export function isCron(cronString: string): boolean {
    var validator = cronParse.parseString(cronString);
    if (!validator.errors || validator.errors.length == 0) {
        return true;
    }
    return false;
}

export function similarity(s1: string, s2: string) {
    let longer = s1;
    var shorter = s2;
    if (s1.length < s2.length) {
        longer = s2;
        shorter = s1;
    }
    var longerLength = longer.length;
    if (longerLength == 0) {
        return 1.0;
    }
    return (longerLength - editDistance(longer, shorter)) / longerLength;
}

function editDistance(s1: string, s2: string) {
    s1 = s1.toLowerCase();
    s2 = s2.toLowerCase();

    var costs = new Array();
    for (var i = 0; i <= s1.length; i++) {
        var lastValue = i;
        for (var j = 0; j <= s2.length; j++) {
            if (i == 0)
                costs[j] = j;
            else {
                if (j > 0) {
                    var newValue = costs[j - 1];
                    if (s1.charAt(i - 1) != s2.charAt(j - 1))
                        newValue = Math.min(Math.min(newValue, lastValue),
                            costs[j]) + 1;
                    costs[j - 1] = lastValue;
                    lastValue = newValue;
                }
            }
        }
        if (i > 0)
            costs[s2.length] = lastValue;
    }
    return costs[s2.length];
}