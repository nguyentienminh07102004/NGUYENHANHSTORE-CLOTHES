import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "../../entity/user.entity";
import { ProductEntity } from "../../entity/product.entity";
import { ProductTypeEntity } from "../../entity/product-type.entity";
import { UserAddressEntity } from "../../entity/user-address.entity";
import { JwtEntity } from "../../entity/jwt.entity";
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { ProductReviewEntity } from "../../entity/product-review.entity";
import { ProductFavouriteEntity } from "../../entity/product-favourite.entity";

@Module({
    imports: [TypeOrmModule.forRootAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService): TypeOrmModuleOptions => ({
            type: 'postgres',
            host: configService.get<string>("POSTGRES_HOST"),
            port: configService.get<number>("POSTGRES_PORT"),
            username: configService.get<string>("POSTGRES_USERNAME"),
            password: configService.get<string>("POSTGRES_PASSWORD"),
            database: configService.get<string>("POSTGRES_DATABASE"),
            entities: [UserEntity, ProductEntity, ProductTypeEntity, UserAddressEntity, JwtEntity, ProductReviewEntity, ProductFavouriteEntity],
            synchronize: true,
            logging: true
        })
    })],
})
export class DatabaseConfigModule {
}