import {ApiProperty} from "@nestjs/swagger";

export class ProductResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    price: number;
    @ApiProperty()
    image: string;
    @ApiProperty()
    type: string;
}