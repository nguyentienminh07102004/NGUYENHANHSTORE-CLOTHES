import {IsEmail, MinLength} from "class-validator";

export class UserRegister {
    @IsEmail({}, {message: 'Email is invalid'})
    email: string;
    @MinLength(8, {message: 'Password must be at least 8 characters'})
    password: string;
    @MinLength(8, {message: 'Password must be at least 8 characters'})
    confirmPassword: string;
    fullName: string;
    phone: string;
    role: string;
}