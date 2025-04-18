import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {HttpModule} from "@nestjs/axios";
import {UserEntity} from "../../entity/user.entity";
import {UserController} from "./user.controller";
import {UserService} from "./user.service";
import {JwtModule} from "../jwt/jwt.module";
import {ProductFavouriteModule} from "../product-favourites/product-favourite.module";

@Module({
    imports: [TypeOrmModule.forFeature([UserEntity]), HttpModule, JwtModule, ProductFavouriteModule],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {
}