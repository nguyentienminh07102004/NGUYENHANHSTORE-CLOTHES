import {ApiProperty} from "@nestjs/swagger";
import {Role} from "../../../common/enum/Role.enum";

export class JwtPayload {
    @ApiProperty()
    jwtId: string;
    @ApiProperty()
    sub: string;
    @ApiProperty()
    role: Role;
}