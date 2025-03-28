import {ArgumentsHost, Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import {Response} from "express";
import {HttpArgumentsHost} from "@nestjs/common/interfaces";

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
    catch(exception: HttpException, host: ArgumentsHost): any {
        const ctx: HttpArgumentsHost = host.switchToHttp();
        const response: Response = ctx.getResponse<Response>();
        const status: number = exception.getStatus();
        response
            .status(status)
            .json({
                status: status,
                exception: exception.message
            });
    }
}