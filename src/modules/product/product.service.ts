import {Inject, Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {ProductEntity} from "../../Domains/product.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductRequest} from "./dto/ProductRequest.dto";
import {plainToInstance} from "class-transformer";
import {ProductTypeService} from "../product-type/product-type.service";
import {PagedModel} from "../../DTO/PagedModel.dto";

@Injectable()
export class ProductService {
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>;
    @Inject()
    private productTypeService: ProductTypeService;

    async save(productRequest: ProductRequest): Promise<ProductEntity> {
        const productEntity: ProductEntity = plainToInstance<ProductEntity, ProductRequest>(ProductEntity, productRequest, {excludePrefixes: ["_"]});
        productEntity.typeProduct = await this.productTypeService.findById(productRequest._typeProductId);
        return await this.productRepository.save(productEntity);
    }

    async findAll(page: number, limit: number): Promise<PagedModel<ProductEntity>> {
        const [products, count] = await this.productRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
        });
        return {
            content: products,
            page: {
                page: page,
                size: limit,
                totalElements: count,
                totalPages: Math.ceil(count / limit)
            }
        }
    }
}