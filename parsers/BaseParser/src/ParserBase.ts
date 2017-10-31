/**
 * Created by   on 3/5/2017.
 */

import { ProviderStatus } from "./ProviderStatus";
export abstract class ParserBase {
    protected static stopped: boolean;
    protected static parsing: boolean;
    protected successor: ParserBase;
    protected static countries: any = {};
    protected static markets: any = {};

    setSuccessor(successor: ParserBase) {
        this.successor = successor;
        return successor;
    }

    abstract async processRequest(data?);

    async start() {
        ParserBase.stopped = false;
        ParserBase.parsing = true;
        return this.processRequest();
    };

    async stop() {
        ParserBase.stopped = true;
        ParserBase.parsing = false;
    };

    public async restart() {
        await this.stop();
        return this.start();
    }

    public get status(): ProviderStatus {
        if (ParserBase.stopped) return ProviderStatus.STOPPED;
        if (ParserBase.parsing) return ProviderStatus.PARSING;
        return ProviderStatus.ACTIVE;
    }
}