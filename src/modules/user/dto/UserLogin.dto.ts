import {IsEmail} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UserLogin {
	@IsEmail({}, {message: 'Email is invalid'})
	@ApiProperty({name: 'email', required: true})
	email: string;
	@ApiProperty({name: 'password', required: true})
	password?: string;
	@ApiProperty({name: 'isSocial', required: false})
	isSocial?: boolean;
}