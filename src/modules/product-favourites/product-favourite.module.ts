import {Module} from "@nestjs/common";
import {ProductFavouriteService} from "./product-favourite.service";
import {ProductModule} from "../product/product.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductFavouriteEntity} from "../../entity/product-favourite.entity";

@Module({
    imports: [ProductModule, TypeOrmModule.forFeature([ProductFavouriteEntity])],
    controllers: [],
    providers: [ProductFavouriteService],
    exports: [ProductFavouriteService],
})
export class ProductFavouriteModule {}