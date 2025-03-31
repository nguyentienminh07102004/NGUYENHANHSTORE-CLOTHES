import {Module} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "../../Domains/user.entity";
import {ProductEntity} from "../../Domains/product.entity";
import {ProductTypeEntity} from "../../Domains/product-type.entity";
import {UserAddressEntity} from "../../Domains/user-address.entity";
import {JwtEntity} from "../../Domains/jwt.entity";
import {TypeOrmModuleOptions} from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";

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
            entities: [UserEntity, ProductEntity, ProductTypeEntity, UserAddressEntity, JwtEntity],
            synchronize: true,
            logging: true
        })
    })],
})
export class DatabaseConfigModule {
}