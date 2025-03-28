import {IsEmail, MinLength} from "class-validator";

export class UserLogin {
	@IsEmail({}, {message: 'Email is invalid'})
	email: string;
	@MinLength(8, {message: 'Password must be at least 8 characters'})
	password: string;
}