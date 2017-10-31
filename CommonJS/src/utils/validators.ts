import { isNumber } from "util";
import { toNumber } from "lodash";

export function isNummericArray(array: number[]) {
    let isNummeric = array ? true : false;
    if (!isNummeric) return isNummeric;
    for (var i = 0; i < array.length; i++) {
        if (!isNumber(Number(array[i]))) {
            isNummeric = false;
            return
        };
    }
    return isNummeric;
}

export function isNotNumber(value: any): value is undefined {
    if (value === 0 || value === "0") return false;
    return value === undefined || toNumber(value) == 0 || isNaN(toNumber(value));
}