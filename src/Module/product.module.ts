import {Module} from "@nestjs/common";
import {ProductController} from "../Controller/product.controller";
import {ProductService} from "../Service/product.service";
import {ProductTypeModule} from "./productType.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "../Domains/product.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity]), ProductTypeModule],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}