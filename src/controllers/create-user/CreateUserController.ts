import * as HttpStatusCode from 'http-status-codes';
import { Request, Response } from "express";
import { celebrate, Joi } from 'celebrate';

import { CreateUserProvider, AuthorizeUserProvider } from "../../database/provider";
import { responseHandler } from '../../services/helper';

export class CreateUserController {
    validation = celebrate({
        headers: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required(),
            name: Joi.string().max(150).min(3).required(),
        }).unknown(),
    }, { abortEarly: false });

    async execute({ headers }: Request, res: Response): Promise<Response> {
        const { name, email, password } = headers;

        if (!name && !email && !password) {
            return responseHandler(res, {
                message: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.BAD_REQUEST),
                error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.BAD_REQUEST),
                statusCode: HttpStatusCode.StatusCodes.BAD_REQUEST,
            });
        }

        const createUserProvider = new CreateUserProvider();

        const createdUser = await createUserProvider.execute({
            id: null,
            name: String(name),
            email: String(email),
            password: String(password)
        });

        if (!createdUser) {
            return responseHandler(res, {
                error: HttpStatusCode.getStatusText(HttpStatusCode.StatusCodes.BAD_REQUEST),
                statusCode: HttpStatusCode.StatusCodes.BAD_REQUEST,
                message: 'User was not created',
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

        return responseHandler(res, {
            statusCode: HttpStatusCode.StatusCodes.CREATED,
            data: {
                user: {
                    name: createdUser.name,
                    email: createdUser.email,
                },
                accessToken,
            },
        });
    }
}
