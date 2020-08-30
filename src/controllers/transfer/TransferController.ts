import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { celebrate, Joi } from 'celebrate';

import { TransferProvider } from '../../database/provider';
import { responseHandler } from "../../services/helper";
import { jwtDecode } from "../../services/auth";

export class TransferController {

    validation = celebrate({
        headers: Joi.object({
            authorization: Joi.string().required(),
        }).unknown(),
        body: Joi.object({
            transferValue: Joi.number().required().min(1),
            accountNumber: Joi.string().required().regex(/^\d{7}\-\d{1}$/),
            targetCpf: Joi.string().required().regex(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/),
        }).unknown(),
    }, { abortEarly: false });

    async execute({ headers, body }: Request, res: Response): Promise<Response> {

        const { authorization } = headers;
        if (!authorization) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const { transferValue } = body;
        if (!transferValue) return responseHandler(res, {
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

        const transferProvider = new TransferProvider();
        const balance = await transferProvider.execute(jwtData.user_id, transferValue);
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
