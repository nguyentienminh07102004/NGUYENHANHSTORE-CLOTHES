import {IsEmail, MinLength} from "class-validator";
import {Expose} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../../common/enum/Role.enum";

export class UserRegister {
    @IsEmail()
    @ApiProperty({name: 'email', required: true})
    email: string;
    @Expose({name: "password"})
    @MinLength(8)
    @ApiProperty({name: 'password', required: true})
    _password: string;
    @Expose({name: "confirmPassword"})
    @ApiProperty({name: 'confirmPassword', required: true})
    @MinLength(8)
    _confirmPassword: string;
    @ApiProperty({name: 'fullName', required: true})
    fullName: string;
    @ApiProperty({name: 'phone', required: true})
    phone: string;
    @ApiProperty({name: 'role', required: true})
    role: Role;
}