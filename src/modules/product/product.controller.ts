import {Body, Controller, Get, HttpCode, Inject, Post, Query} from "@nestjs/common";
import {ProductRequest} from "./dto/ProductRequest.dto";
import {Roles} from "../../common/decorator/Roles.decorator";
import {Role} from "../../common/enum/Role.enum";
import {Public} from "../../common/decorator/Public.decorator";
import {APIResponse} from "../../DTO/APIResponse.dto";
import {ProductEntity} from "../../Domains/product.entity";
import {ProductService} from "./product.service";
import {PagedModel} from "../../DTO/PagedModel.dto";

@Controller('products')
export class ProductController {
    @Inject()
    private readonly productService: ProductService;

    @Post()
    @Roles(Role.ADMIN)
    @HttpCode(201)
    async save(@Body() productRequest: ProductRequest) {
        return await this.productService.save(productRequest);
    }

    @Get()
    @Public()
    @HttpCode(200)
    async findAll(@Query() page: number, @Query() limit: number) {
        const pagedModel = await this.productService.findAll(page, limit);
        const response: APIResponse<PagedModel<ProductEntity>> = {
            data: pagedModel,
            status: 200,
            message: "SUCCESS"
        };
        return response;
    }
}