import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { celebrate, Joi } from 'celebrate';

import { AuthorizeUserProvider, UserInfoProvider } from "../../database/provider";
import { responseHandler } from '../../services/helper';

export class AuthorizeUserController {
    validation = celebrate({
        headers: Joi.object({
            password: Joi.string().required(),
            email: Joi.string().email().required(),
        }).unknown(),
    }, { abortEarly: false });

    async execute({ headers }: Request, res: Response): Promise<Response> {
        const { email, password } = headers;

        if (!email && !password) {
            return responseHandler(res, {
                error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.BAD_REQUEST),
                message: 'Email or password is not valid',
                statusCode: HttpStatusCode.StatusCodes.BAD_REQUEST,
            });
        }

        const authorizeUserProvider = new AuthorizeUserProvider();
        const accessToken = await authorizeUserProvider.execute({
            email: String(email),
            password: String(password)
        });

        if (!accessToken) {
            return responseHandler(res, {
                error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.BAD_REQUEST),
                statusCode: HttpStatusCode.StatusCodes.BAD_REQUEST,
                message: 'Login failed',
            });
        }

        const userInfoProvider = new UserInfoProvider();
        const userInfo = await userInfoProvider.getByEmail(String(email));

        if (!userInfo) {
            return responseHandler(res, {
                error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.BAD_REQUEST),
                statusCode: HttpStatusCode.StatusCodes.BAD_REQUEST,
                message: 'User infomration was not found',
            });
        }

        return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.OK,
            data: {
                user: {
                    email,
                    name: userInfo.name,
                    agency: userInfo.agency,
                    account_number: userInfo.account_number,
                },
                accessToken,
            },
        });
    }
}
