import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { celebrate, Joi } from 'celebrate';

import { DepositProvider } from '../../database/provider';
import { responseHandler } from "../../services/helper";
import { jwtDecode } from "../../services/auth";

export class DepositController {

    validation = celebrate({
        headers: Joi.object({
            authorization: Joi.string().required(),
        }),
        body: Joi.object({
            deposit: Joi.number().required().min(0),
        }).unknown(),
    }, { abortEarly: false });

    async execute({ headers, body }: Request, res: Response): Promise<Response> {

        const authorization = headers?.authorization;
        if (!authorization) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const depositValue = body?.deposit;
        if (!depositValue) return responseHandler(res, {
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

        const depositProvider = new DepositProvider();
        const balance = await depositProvider.execute(jwtData.user_id, depositValue);
        if (!balance) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.INTERNAL_SERVER_ERROR,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.INTERNAL_SERVER_ERROR),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.INTERNAL_SERVER_ERROR),
        });

        return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.OK,
            data: { success: true }
        });
    }
}
