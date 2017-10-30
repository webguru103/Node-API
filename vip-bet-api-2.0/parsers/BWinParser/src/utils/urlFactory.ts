/**
 * Created by   on 2/24/2017.
 */
import formatter = require("strformat");
import { v4 } from "uuid";

export class URLFactory {
    //replaces placeholders with object's properties
    // and adds User-Agent to request
    public static request(url: string, headers?: { [key: string]: string }, method?: string, data?: { [key: string]: string }) {
        headers = Object.assign({
            'User-Agent': 'request',
            'Content-Type': 'application/json'
        }, headers);
        return {
            id: v4(),
            url: formatter(url),
            method: method || "get",
            headers: headers,
            json: data
        }
    }
}