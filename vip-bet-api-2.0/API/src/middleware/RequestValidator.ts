import { Request, Response, NextFunction } from 'express';
import { isArray } from "lodash";
import { BAD_REQUEST } from "http-status-codes";
import { RespondWithError } from "./base.middleware";
import { map } from "bluebird";

export function IdValidatorParams(req: Request, res: Response, next: NextFunction) {
    if (req.params.id !== undefined) return next();
    return RespondWithError(req, res, BAD_REQUEST);
}

export function IdValidatorQuery(req: Request, res: Response, next: NextFunction) {
    if (req.query.id !== undefined) return next();
    return RespondWithError(req, res, BAD_REQUEST);
}

export function IdValidatorBody(req: Request, res: Response, next: NextFunction) {
    if (req.body.id !== undefined) return next();
    return RespondWithError(req, res, BAD_REQUEST);
}

export async function PlaceBetSlipValidator(req: Request, res: Response, next: NextFunction) {
    // compare betslip entities
    delete req.body.id;
    const betslipKeys = Object.keys(req.body);
    const betslipExpectedKeys = ['money_type', 'details'];
    // find missing field
    const betslipMissingField = betslipExpectedKeys.find(k => !betslipKeys.includes(k));
    // if found return with error
    if (betslipMissingField)
        return RespondWithError(req, res, BAD_REQUEST, `WRONG_ENTITY: betslip missing field ${betslipMissingField}`);
    // if betslips details is not list return error
    if (!isArray(req.body.details))
        return RespondWithError(req, res, BAD_REQUEST, `WRONG_ENTITY: details should be array`);
    // compare detail entities
    let errors = await map(req.body.details, async (detail: any) => {
        delete detail.betlslip_id;
        const detailKeys = Object.keys(detail);
        const detailExpectedKeys = [
            'event_selection_id',
            'group',
            'is_lobby',
            'odd',
            'provider_id',
        ];
        // find missing field
        const detailMissingField = detailExpectedKeys.find(k => !detailKeys.includes(k));
        // if missing field return with error
        if (detailMissingField) {
            return RespondWithError(req, res, BAD_REQUEST, `detail missing field  ${detailMissingField}`);
        }
    })
    errors = errors.filter(e => e !== null && e !== undefined);
    if (errors.length > 0) return errors[0];
    next();
}