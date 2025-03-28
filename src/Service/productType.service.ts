import {Injectable, NotFoundException} from "@nestjs/common";
import {DataSource} from "typeorm";
import {InjectDataSource} from "@nestjs/typeorm";
import {ProductTypeEntity} from "../Domains/product-type.entity";
import {ExceptionVariable} from "../Exception/ExceptionVariable";

@Injectable()
export class ProductTypeService {
    constructor(
        @InjectDataSource()
        private dataSource: DataSource) {
    }

    async findByName(name: string): Promise<ProductTypeEntity> {
        const productType =  await this.dataSource.getRepository<ProductTypeEntity>(ProductTypeEntity)
            .findOne({where: {name: name}});
        if (!productType) {
            throw new NotFoundException(ExceptionVariable.PRODUCT_TYPE_NOT_FOUND);
        }
        return productType;
    }
}