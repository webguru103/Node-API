/**
 * Created by   on 2/24/2017.
 */
import formatter = require("strformat");

export class URLFactory {
    //replaces placeholders with object's properties
    // and adds User-Agent to request
    public static getRequest(url: string) {
        return {
            url: formatter(url),
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/xml'
            }
        }
    }
}