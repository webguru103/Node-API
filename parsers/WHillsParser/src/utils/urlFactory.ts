/**
 * Created by   on 2/24/2017.
 */
export class URLFactory {
    //replaces placeholders with object's properties
    // and adds User-Agent to request
    public static getRequest(url: string) {
        return {
            url: url,
            headers: {
                'User-Agent': 'request',
                'Content-Type': 'application/xml'
            }
        };
    }

}