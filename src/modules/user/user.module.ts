import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {HttpModule} from "@nestjs/axios";
import {UserEntity} from "../../Domains/user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {JwtModule} from "../jwt/jwt.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), HttpModule, JwtModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}