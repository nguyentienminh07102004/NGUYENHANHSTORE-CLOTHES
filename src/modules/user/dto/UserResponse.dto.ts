
import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../../common/enum/Role.enum";

export class UserResponse {
    @ApiProperty({name: 'id', required: true})
    id: string;
    @ApiProperty({name: 'email', required: true})
    email: string;
    @ApiProperty({name: 'fullName', required: true})
    fullName: string;
    @ApiProperty({name: 'phone', required: true})
    phone: string;
    @ApiProperty({name: 'avatar', required: true})
    avatar: string;
    @ApiProperty({name: 'role', required: true})
    role: Role;
}