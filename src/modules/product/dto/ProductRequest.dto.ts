import {IsNotEmpty, IsNumber, IsPositive, IsUUID} from "class-validator";
import {Expose, Transform} from "class-transformer";
import {ApiProperty} from "@nestjs/swagger";

export class ProductRequest {
    @Transform(({value}) => value && value.trim())
    @IsNotEmpty()
    @ApiProperty()
    name: string;
    @ApiProperty()
    description: string;
    @ApiProperty()
    image: string;
    @IsNumber()
    @IsPositive()
    @ApiProperty()
    price: number;
    @IsUUID()
    @ApiProperty()
    @Expose({name: "typeProductId"})
    _typeProductId: string;
}