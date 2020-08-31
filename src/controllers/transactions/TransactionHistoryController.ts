import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { Joi, celebrate } from 'celebrate';

import { TransactionHistoryProvider } from '../../database/provider';
import { responseHandler } from "../../services/helper";
import { jwtDecode } from "../../services/auth";

export class TransactionHistoryController {

    validation = celebrate({
        headers: Joi.object({
            authorization: Joi.string().required(),
        }).unknown()
    }, { abortEarly: false });

    async execute({ headers }: Request, res: Response): Promise<Response> {
        const { authorization } = headers;
        if (!authorization) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const jwtData = jwtDecode(authorization);
        if (!jwtData) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.UNAUTHORIZED),
        });

        const transactionHistoryProvider = new TransactionHistoryProvider();
        const transactions = await transactionHistoryProvider.getAllByUserId(jwtData.user_id);

        if (!transactions) return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.NOT_FOUND,
            error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_FOUND),
            message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.NOT_FOUND),
        });

        return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.OK,
            data: {
                transactions: transactions.map(transaction => ({
                    created_at: transaction.created_at,
                    type: transaction.type_id,
                    value: transaction.value,
                }))
            }
        });
    }
}
