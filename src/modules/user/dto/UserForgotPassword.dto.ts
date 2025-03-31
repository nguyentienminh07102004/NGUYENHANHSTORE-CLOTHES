import {IsNotEmpty, MinLength} from "class-validator";
import {Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class UserForgotPassword {
    @Transform(({value}) => value.trim())
    @IsNotEmpty()
    @ApiProperty({name: "code", required: true})
    code: string;
    @MinLength(8)
    @ApiProperty({name: "newPassword", required: true})
    newPassword: string;
    @MinLength(8)
    @ApiProperty({name: "confirmPassword", required: true})
    confirmPassword: string;
}