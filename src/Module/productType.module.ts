import {Module} from "@nestjs/common";
import {ProductTypeService} from "../Service/productType.service";
import {ProductTypeController} from "../Controller/productType.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductTypeEntity} from "../Domains/product-type.entity";

@Module({
    imports: [TypeOrmModule.forFeature([ProductTypeEntity])],
    controllers: [ProductTypeController],
    providers: [ProductTypeService],
    exports: [ProductTypeService]
})
export class ProductTypeModule {}