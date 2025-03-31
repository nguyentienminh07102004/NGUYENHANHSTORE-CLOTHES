import {ApiProperty} from "@nestjs/swagger";

export class APIResponse<T> {
    @ApiProperty({name: 'status', required: true})
    status: number;
    @ApiProperty({name: 'message', required: true})
    message: string;
    @ApiProperty({name: 'data', required: false})
    data?: T;
}