import { Response } from "express";

interface IHandlerProps<T = any> {
    statusCode: number;
    message?: string;
    error?: string;
    data?: T
}

export function responseHandler<T = any>(res: Response, props: IHandlerProps<T>): Response {
    return res.status(props.statusCode).json({ ...props });
}
