import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { celebrate, Joi } from 'celebrate';

import { CreateBilletProvider } from '../../database/provider';
import { responseHandler } from '../../services/helper';

export class CreateBilletController {
    validation = celebrate({
        headers: Joi.object({
            authorization: Joi.string().required(),
        }).unknown(),
        body: Joi.object({
            value: Joi.number().required().min(1),
            code: Joi.string().required().min(3).max(255),
            favored: Joi.string().max(255).min(2).required(),
        }).unknown(),
    }, { abortEarly: false });

    async execute({ headers, body }: Request, res: Response): Promise<Response> {

        const { authorization } = headers;
        if (!authorization) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const { value, code, favored } = body;
        if (!value || !code || !favored) {
            return responseHandler(res, {
                message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
                error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_ACCEPTABLE),
                statusCode: HttpStatusCode.StatusCodes.NOT_ACCEPTABLE,
            });
        }

        const createBilletProvider = new CreateBilletProvider();
        const createdBilletCode = await createBilletProvider.execute({ code, value, favored });

        if (!createdBilletCode) {
            return responseHandler(res, {
                error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.BAD_REQUEST),
                statusCode: HttpStatusCode.StatusCodes.BAD_REQUEST,
                message: 'Billet was not created',
            });
        }

        return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.CREATED,
            data: {
                success: true
            },
        });
    }
}
