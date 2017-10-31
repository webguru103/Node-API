/**
 * Created by   on 2/26/2017.
 */
import request = require("request");
import schedule = require("node-schedule");
import { defer } from "bluebird";
import parseString = require('xml2js');

export class HTTPUtil {
    private static queue: any[] = [];
    private static queuePromises: any = {};
    private static urlETag = {};

    static init() {
        schedule.scheduleJob('* * * * * *', () => {
            HTTPUtil.makeRequest(1000);
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
    public static scheduleGetData(reqObj: any) {
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
            reqObj.headers['ETag'] = this.urlETag[reqObj.url] || null;
            let defers = this.queuePromises[reqObj.url];
            delete this.queuePromises[reqObj];

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
                    this.urlETag[reqObj.url] = res.headers.etag;

                    let data;
                    if (res.statusCode == 200) {
                        data = body;
                    }
                    data = data.replace(new RegExp("ns2:", 'g'), "");
                    data = data.replace(new RegExp("ns3:", 'g'), "");
                    parseString.parseString(data, { trim: true }, (err, result) => {
                        defers.forEach(defer => {
                            defer.resolve(result)
                        });
                    });
                }
            })
        }
    }
}