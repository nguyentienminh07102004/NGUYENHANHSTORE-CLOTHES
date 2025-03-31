import {Injectable, NotFoundException} from "@nestjs/common";
import {ProductTypeEntity} from "../../Domains/product-type.entity";
import {Repository} from "typeorm";
import {InjectRepository} from "@nestjs/typeorm";
import {ExceptionVariable} from "../../common/filters/HttpExceptionFilter.filter";

@Injectable()
export class ProductTypeService {
    @InjectRepository(ProductTypeEntity)
    private readonly productTypeRepository: Repository<ProductTypeEntity>;

    async findById(id: string): Promise<ProductTypeEntity> {
        const productType = await this.productTypeRepository.findOneBy({id: id});
        if (!productType) {
            throw new NotFoundException(ExceptionVariable.PRODUCT_TYPE_NOT_FOUND);
        }
        return productType;
    }
}