import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { ProductEntity } from "../../entity/product.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { ProductRequest } from "./dto/ProductRequest.dto";
import { plainToInstance } from "class-transformer";
import { ProductTypeService } from "../product-type/product-type.service";
import { PagedModel } from "../../DTO/PagedModel.dto";
import { ExceptionVariable } from "../../common/filters/HttpExceptionFilter.filter";
import { ProductResponse } from "./dto/ProductResponse.dto";

@Injectable()
export class ProductService {
    @InjectRepository(ProductEntity)
    private productRepository: Repository<ProductEntity>;
    @Inject()
    private productTypeService: ProductTypeService;

    async save(productRequest: ProductRequest): Promise<ProductEntity> {
        const productEntity: ProductEntity = plainToInstance<ProductEntity, ProductRequest>(ProductEntity, productRequest, { excludePrefixes: ["_"] });
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

    async findById(id: string): Promise<ProductResponse> {
        const product = await this.findProductEntityById(id);
        return plainToInstance<ProductResponse, ProductEntity>(ProductResponse, product, { excludePrefixes: ["_"] });
    }

    async findProductEntityById(id: string): Promise<ProductEntity> {
        const product = await this.productRepository.findOneBy({ id: id });
        if (!product) {
            throw new NotFoundException(ExceptionVariable.PRODUCT_NOT_FOUND);
        }
        return product;
    }
}