import {Module} from "@nestjs/common";
import {ProductTypeController} from "./product-type.controller";
import {TypeOrmModule} from "@nestjs/typeorm";
import {ProductTypeEntity} from "../../Domains/product-type.entity";
import {ProductTypeService} from "./product-type.service";

@Module({
    imports: [TypeOrmModule.forFeature([ProductTypeEntity])],
    controllers: [ProductTypeController],
    providers: [ProductTypeService],
    exports: [ProductTypeService]
})
export class ProductTypeModule {}