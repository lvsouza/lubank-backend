import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { Joi, celebrate } from 'celebrate';

import { BilletInfoProvider } from '../../database/provider';
import { responseHandler } from "../../services/helper";
import { jwtDecode } from "../../services/auth";

export class BilletInfoController {

    validation = celebrate({
        headers: Joi.object({
            authorization: Joi.string().required(),
        }).unknown(),
        body: Joi.object({
            code: Joi.string().required().min(3).max(255),
        }).unknown(),
    }, { abortEarly: false });

    async execute({ headers, body }: Request, res: Response): Promise<Response> {
        const { authorization } = headers;
        if (!authorization) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const { code } = body;
        if (!code) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.NOT_ACCEPTABLE,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
        });

        const jwtData = jwtDecode(authorization);
        if (!jwtData) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const billetInfoProvider = new BilletInfoProvider();
        const billet = await billetInfoProvider.findByCode(code);

        if (!billet) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.NOT_FOUND,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_FOUND),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_FOUND),
        });

        return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.OK,
            data: {
                code: billet.code,
                value: billet.value,
                favored: billet.favored,
            }
        });
    }
}
