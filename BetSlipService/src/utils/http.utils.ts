import { get, post } from "request";

export function Get(url: string, body?: { [key: string]: any }, headers?: { [key: string]: any }):Promise<any> {
    return new Promise((res, rej) => {
        get(
            url,
            {
                json: true,
                headers: headers,
                method: "GET",
                body: body,
                strictSSL: false
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res(body)
                } else {
                    rej(error);
                }
            }
        );
    })
}

export function Post(url: string, params?: { [key: string]: any }, headers?: { [key: string]: any }):Promise<any> {
    return new Promise((res, rej) => {
        post(
            url,
            {
                json: true,
                headers: headers,
                method: "POST",
                body: params,
                strictSSL: false
            },
            function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    res(body)
                } else {
                    rej(error)
                }
            }
        );
    })
} 