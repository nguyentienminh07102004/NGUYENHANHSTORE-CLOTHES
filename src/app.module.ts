import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {UserEntity} from 'src/Domains/user.entity';
import {UserModule} from 'src/Module/user.module';
import {JwtModule} from "@nestjs/jwt";
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./Guard/AuthGuard";
import {RolesGuard} from "./Guard/RoleGuard";
import {ProductModule} from "./Module/product.module";
import {ProductEntity} from "./Domains/product.entity";
import {ProductTypeEntity} from "./Domains/product-type.entity";
import {ProductTypeModule} from "./Module/productType.module";

@Module({
    imports: [TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: '123',
        database: 'nguyenhanhstore',
        entities: [UserEntity, ProductEntity, ProductTypeEntity],
        synchronize: true,
        logging: true,
        logger: "debug"
    }),
        JwtModule.register({
            global: true,
            secret: "qpRMndqeDpqvjh39ChuXJmprH57R3yMspe4IFNmQiXcCJD/KwDSDoM6mEc17xz+S",
            signOptions: {expiresIn: "86400s", algorithm: "HS512"},
        }),
        UserModule,
        ProductModule,
        ProductTypeModule,
    ],
    controllers: [],
    providers: [{
            provide: APP_GUARD,
            useClass: AuthGuard,
        },
        {
            provide: APP_GUARD,
            useClass: RolesGuard,
        }
    ],
})
export class AppModule {}