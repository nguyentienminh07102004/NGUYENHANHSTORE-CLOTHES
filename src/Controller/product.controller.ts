import {Body, Controller, Post} from "@nestjs/common";
import {ProductRequest} from "../DTO/Product/ProductRequest.dto";
import {ProductService} from "../Service/product.service";
import {Roles} from "../Decorator/Roles.decorator";
import {Role} from "../Bean/Role.enum";

@Controller('api/products')
export class ProductController {
    constructor(private readonly productService: ProductService) {}

    @Post()
    @Roles(Role.ADMIN)
    async save (@Body() productRequest: ProductRequest) {
        return await this.productService.save(productRequest);
    }
}