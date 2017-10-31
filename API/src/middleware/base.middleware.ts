import { BAD_REQUEST, getStatusText as GetErrorCode, OK } from "http-status-codes";
import { Request, Response } from "express";

export function RespondWithError(request: Request, response: Response, error_code: number = BAD_REQUEST, text?: string, e_code?: string | number) {
    if (response.headersSent) return
    return response.status(error_code).json({
        error: GetErrorCode(error_code),
        code: error_code,
        e_code: e_code ? `${e_code}` : `${GetErrorCode(error_code)}_${error_code}`,
        text: text || GetErrorCode(error_code),
        query: request.query,
        original_url: request.originalUrl,
        debug_headers: request.headers,
        timestamp: new Date().toUTCString()
    }).end()
}

export function RespondWithJson(response: Response, data: object = {}, status = OK, ...args: object[]) {
    if (response.headersSent) return;
    return response.status(status).json(
        Object.assign({}, {
            status: status,
            timestamp: new Date().toUTCString()
        }, ...args, { data })
    ).end()
}

export function RespondWithOK(response: Response, data: object = {}, status = OK, ...args: object[]) {
    if (response.headersSent) return;
    return response.status(status).json(data).end();
}

export async function Respond(request: Request, response: Response, data: any = {}, status = OK) {
    if (response.headersSent) return;
    return response.status(status).json(
        Object.assign({}, {
            status: status,
            timestamp: new Date().toUTCString()
        }, await data)
    ).end()
}