import {Injectable} from "@nestjs/common";
import {ProductRequest} from "../DTO/Product/ProductRequest.dto";
import {InjectRepository} from "@nestjs/typeorm";
import {ProductEntity} from "../Domains/product.entity";
import {Repository} from "typeorm";
import {ProductTypeService} from "./productType.service";

@Injectable()
export class ProductService {
    constructor(@InjectRepository(ProductEntity)
                private readonly productRepository: Repository<ProductEntity>,
                private readonly productTypeService: ProductTypeService) {
    }

    async save(productRequest: ProductRequest) {
        const product: ProductEntity = {
            name: productRequest.name,
            price: productRequest.price,
            description: productRequest.description,
            image: productRequest.image,
            typeProduct: await this.productTypeService.findByName(productRequest.typeProduct)
        }
        return await this.productRepository.save(product);
    }
}