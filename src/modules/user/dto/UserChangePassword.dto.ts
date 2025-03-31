import {MinLength} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserChangePassword {
    @MinLength(8)
    @ApiProperty({name: "oldPassword", required: true})
    oldPassword: string;
    @MinLength(8)
    @ApiProperty({name: "newPassword", required: true})
    newPassword: string;
    @MinLength(8)
    @ApiProperty({name: "confirmPassword", required: true})
    confirmPassword: string;
}