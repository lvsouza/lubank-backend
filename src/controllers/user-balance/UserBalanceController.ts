import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";

import { UserBalanceProvider } from '../../database/provider';
import { responseHandler } from "../../services/helper";
import { jwtDecode } from "../../services/auth";

export class UserBalanceController {
    async execute({ headers }: Request, res: Response): Promise<Response> {
        const authorization = headers?.authorization;
        if (!authorization) return responseHandler(res, {
            statusCode: HttpStatusCode.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.UNAUTHORIZED),
        });

        const jwtData = jwtDecode(authorization);
        if (!jwtData) return responseHandler(res, {
            statusCode: HttpStatusCode.UNAUTHORIZED,
            error: HttpStatusCode.getStatusText(HttpStatusCode.UNAUTHORIZED),
            message: HttpStatusCode.getStatusText(HttpStatusCode.UNAUTHORIZED),
        }); 

        const userBalanceProvider = new UserBalanceProvider();
        const balance = await userBalanceProvider.getBalanceByUserId(jwtData.user_id);

        return responseHandler(res, {
            statusCode: HttpStatusCode.OK,
            data: { balance: balance?.toFixed(2) }
        });
    }
}
