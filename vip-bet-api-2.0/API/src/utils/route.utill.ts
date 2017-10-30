import { Response, Request } from "express";
import { RespondWithError, RespondWithOK } from "../middleware/base.middleware";
import { BAD_REQUEST } from "http-status-codes";
/**
 * Created by   on 3/10/2017.
 */
export async function handleResponse(req: Request, res: Response, action: any) {
    if (!action) {
        if (res) RespondWithOK(res);
        return;
    }
    if (res) {
        action.then(result => {
            RespondWithOK(res, result);
        }, error => {
            RespondWithError(req, res, BAD_REQUEST, error);
        })
    }
}