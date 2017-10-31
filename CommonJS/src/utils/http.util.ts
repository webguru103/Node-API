import formatter = require("strformat");
import { v4 } from "uuid";
import request = require("request");
import schedule = require("node-schedule");
import { defer } from "bluebird";
import { serialize, parse } from "uri-js";
import { parseString } from "xml2js";

const queue: any[] = [];
const queuePromises: any = {};
let httpLimit: number = 1000;
let parsingOption: IParserOption = {};

export function setParsingOption(options: IParserOption) {
    parsingOption = options;
}

export function setRequestLimit(limit: number) {
    httpLimit = limit;
}

function getRequest(url: string, headers?: { [key: string]: string }, method?: string, data?: { [key: string]: string }) {
    headers = Object.assign({
        'User-Agent': 'request',
        'Content-Type': 'application/json'
    }, headers);
    return {
        id: v4(),
        url: formatter(url),
        method: method || "get",
        headers: headers,
        body: data,
        json: data
    }
}

export function queueRequest(url: string, headers?: { [key: string]: string }, method?: string, data?: { [key: string]: string }): any {
    const reqObj = getRequest(url, headers, method, data);
    const deferred = defer();
    if (!queuePromises[reqObj.id]) queuePromises[reqObj.id] = [];
    queuePromises[reqObj.id].push(deferred);
    queue.push(reqObj);
    return deferred.promise;
}

function makeRequest(count: number) {
    for (let i = 0; i < count; i++) {
        if (queue.length == 0) return;

        const reqObj = queue.splice(0, 1)[0];
        const defers = queuePromises[reqObj.id];
        delete queuePromises[reqObj.id];
        reqObj.url = serialize(parse(reqObj.url));

        // console.log(reqObj.url);

        request(reqObj, async (err, res, body) => {
            if (err) {
                if (err.code == "ECONNRESET") {
                    queue.unshift(reqObj);
                    queuePromises[reqObj.id] = defers;
                } else {
                    defers.forEach(defer => {
                        defer.reject(err);
                    });
                }
            } else {
                let data = body;
                if (parsingOption.JSONParser === true) {
                    data = JSON.parse(data);
                    defers.forEach(defer => {
                        defer.resolve(data)
                    });
                } else if (parsingOption.XMLParser === true) {
                    parseString(data, { trim: true }, async (err, result) => {
                        defers.forEach(defer => {
                            defer.resolve(result)
                        });
                    });
                } else {
                    defers.forEach(defer => {
                        defer.resolve(data)
                    });
                }
            }
        })
    }
}

schedule.scheduleJob('* * * * * *', () => {
    makeRequest(httpLimit);
});

export interface IParserOption {
    XMLParser?: boolean,
    JSONParser?: boolean
}