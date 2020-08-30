import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { celebrate, Joi } from 'celebrate';

import { PayBilletProvider } from '../../database/provider';
import { responseHandler } from "../../services/helper";
import { jwtDecode } from "../../services/auth";

export class PayBilletController {

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

        const payBilletProvider = new PayBilletProvider();
        const newBalance = await payBilletProvider.payByCode(jwtData.user_id, code);
        if (!newBalance) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.NOT_ACCEPTABLE,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
        });

        return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.OK,
            data: { success: true }
        });
    }
}
