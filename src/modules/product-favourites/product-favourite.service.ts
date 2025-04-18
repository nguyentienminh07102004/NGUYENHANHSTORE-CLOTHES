import {Inject, Injectable, NotFoundException} from "@nestjs/common";
import {ProductFavouriteEntity} from "../../entity/product-favourite.entity";
import {DataSource, Repository} from "typeorm";
import {InjectDataSource, InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "../../entity/user.entity";
import {ProductService} from "../product/product.service";
import {ExceptionVariable} from "../../common/filters/HttpExceptionFilter.filter";

@Injectable()
export class ProductFavouriteService {
    @InjectRepository(ProductFavouriteEntity)
    private productFavouriteRepository: Repository<ProductFavouriteEntity>;
    @Inject()
    private productService: ProductService;
    @InjectDataSource()
    private dataSource: DataSource;

    async findAllProductFavouritesByEmail(email: string) {
        return await this.dataSource.createQueryBuilder()
            .select(['pf.id', 'product'])
            .from(ProductFavouriteEntity, 'pf')
            .innerJoin('pf.product', 'product')
            .where('pf.user.email = :email', {email})
            .getMany();
    }

    async saveFavourites(user: UserEntity, productId: string) {
        const productFavourite: ProductFavouriteEntity = {
            user: user,
            product: await this.productService.findProductEntityById(productId)
        }
        return await this.productFavouriteRepository.save(productFavourite);
    }

    async deleteFavourites(user: UserEntity, productId: string) {
        const productFavourite = await this.productFavouriteRepository.findOneBy({
            user: user,
            product: await this.productService.findProductEntityById(productId)
        });
        if (!productFavourite) {
            throw new NotFoundException(ExceptionVariable.USER_HAS_NOT_LIKE_PRODUCT);
        }
        return await this.productFavouriteRepository.delete(productFavourite);
    }
}