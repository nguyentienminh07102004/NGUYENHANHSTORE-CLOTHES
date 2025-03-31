import {ApiProperty} from "@nestjs/swagger";

export class UserLoginGoogle {
    @ApiProperty({name: 'code', required: true})
    code: string;
}