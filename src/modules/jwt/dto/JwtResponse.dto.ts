import {ApiProperty} from "@nestjs/swagger";

export class JwtResponse {
    @ApiProperty()
    id: string;
    @ApiProperty()
    token: string;
    @ApiProperty()
    refreshToken: string;
    @ApiProperty()
    refreshTokenExpires: Date;
}