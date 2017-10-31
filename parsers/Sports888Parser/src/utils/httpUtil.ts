/**
 * Created by   on 2/26/2017.
 */
import request = require("request");
import schedule = require("node-schedule");
import {defer} from "bluebird";
import { serialize, parse } from "uri-js";


export class HTTPUtil {
    private static queue: any[] = [];
    private static queuePromises: any = {};

    static init() {
        schedule.scheduleJob('* * * * * *', () => {
            HTTPUtil.makeRequest(2);
        });
    }

    //util function for sending get request
    // and receiving back data
    public static getData(reqObj: any) {
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
    public static scheduleGetData(reqObj: any): any {
        let deferred = defer();
        this.queue.push(reqObj);
        if (!this.queuePromises[reqObj.url]) this.queuePromises[reqObj.url] = [];
        this.queuePromises[reqObj.url].push(deferred);
        return deferred.promise;
    }

    private static makeRequest(count: number) {
        for (let i = 0; i < count; i++) {
            if (this.queue.length == 0) return;

            let reqObj = this.queue.splice(0, 1)[0];
            let defers = this.queuePromises[reqObj.url];
            delete this.queuePromises[reqObj.url];
            reqObj.url = serialize(parse(reqObj.url));
            console.log(reqObj.url);

            request(reqObj, (err, res, body) => {
                if (err) {
                    if (err.code == "ECONNRESET") {
                        this.queue.unshift(reqObj);
                        this.queuePromises[reqObj.url] = defers;
                    } else {
                        defers.forEach(defer => {
                            defer.reject(err);
                        });
                    }
                } else {
                    let data = body;

                    // parseString.parseString(data, {trim: true}, (err, result) => {
                        defers.forEach(defer => {
                            defer.resolve(data)
                        });
                    // });
                }
            })
        }
    }
}