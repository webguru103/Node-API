/**
 * Created by   on 3/26/2017.
 */
import promise = require('bluebird');
import { ProviderBase } from "./ProviderBase";
let options = {
    promiseLib: promise
};
const pgp = require('pg-promise')(options);
const db = pgp('postgres://postgres:qwerty1@localhost:5432/vb-feed-ladbrokes');

export class LadBrokesProvider extends ProviderBase {
    constructor() {
        super();
        this.db = db;
    }
}