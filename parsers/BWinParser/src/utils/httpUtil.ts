/**
 * Created by   on 2/26/2017.
 */
import request = require("request");
import schedule = require("node-schedule");
import { defer } from "bluebird";
import { serialize, parse } from "uri-js";
import { URLFactory } from "./urlFactory";

export class HTTPUtil {
    private static queue: any[] = [];
    private static queuePromises: any = {};

    static init() {
        schedule.scheduleJob('* * * * * *', () => {
            HTTPUtil.makeRequest(1000);
        });
    }

    //util function for sending get request
    // and receiving back data
    public static request(url: string, headers?: { [key: string]: string }, method?: string, data?: { [key: string]: string }) {
        const reqObj = URLFactory.request(url, headers, method, data);
        let deferred = defer();
        request(reqObj, (err, res, body) => {
            if (err) {
                return deferred.reject(err);
            }
            return deferred.resolve(body);
        });

        return deferred.promise;
    }

    //util function for sending get request
    // and receiving back data
    public static scheduleRequest(url: string, headers?: { [key: string]: string }, method?: string, data?: { [key: string]: string }): any {
        const reqObj = URLFactory.request(url, headers, method, data);
        let deferred = defer();
        if (!this.queuePromises[reqObj.id]) this.queuePromises[reqObj.id] = [];
        this.queuePromises[reqObj.id].push(deferred);
        this.queue.push(reqObj);
        return deferred.promise;
    }

    private static makeRequest(count: number) {
        for (let i = 0; i < count; i++) {
            if (this.queue.length == 0) return;

            let reqObj = this.queue.splice(0, 1)[0];
            let defers = this.queuePromises[reqObj.id];
            delete this.queuePromises[reqObj.id];
            reqObj.url = serialize(parse(reqObj.url));
            request(reqObj, (err, res, body) => {
                if (err) {
                    if (err.code == "ECONNRESET") {
                        this.queue.unshift(reqObj);
                        this.queuePromises[reqObj.id] = defers;
                    } else {
                        defers.forEach(defer => {
                            defer.reject(err);
                        });
                    }
                } else {
                    defers.forEach(defer => {
                        defer.resolve(body)
                    });
                }
            })
        }
    }
}