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

export enum ExceptionVariable {
    EMAIL_PASSWORD_NOT_MATCH="Email or password not match!",
    EMAIL_HAS_EXISTS="Email has exists!",
    EMAIL_INVALID="Email address is invalid!",

    PASSWORD_CONFIRM_PASSWORD_NOT_MATCH="Password and confirm password is not match!",
    OLD_PASSWORD_NEW_PASSWORD_NOT_MATCH="Old password and new password mustn't match!",

    PRODUCT_TYPE_NOT_FOUND="Product Type Not Found!",

    USER_NOT_FOUND="User Not Found!",

    CODE_INVALID="Code invalid!",

    JWT_NOT_FOUND="JWT Not Found!",

    ACCOUNT_LOGIN_MAX_DEVICE="Account login in max device",
}