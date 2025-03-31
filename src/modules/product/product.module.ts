import {Module} from "@nestjs/common";
import {ProductController} from "./product.controller";
import {ProductTypeModule} from "../product-type/product-type.module";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductEntity} from "../../Domains/product.entity";
import {ProductService} from "./product.service";

@Module({
    imports: [TypeOrmModule.forFeature([ProductEntity]), ProductTypeModule],
    controllers: [ProductController],
    providers: [ProductService],
    exports: [ProductService],
})
export class ProductModule {}