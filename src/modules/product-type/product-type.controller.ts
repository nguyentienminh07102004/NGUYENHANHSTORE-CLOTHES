import {Controller, Inject} from "@nestjs/common";
import {ProductTypeService} from "./product-type.service";

@Controller('product-types')
export class ProductTypeController {
    @Inject()
    private readonly productTypeService: ProductTypeService;

}