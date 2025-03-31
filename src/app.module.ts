import {Module} from '@nestjs/common';
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./common/guard/AuthGuard.guard";
import {RolesGuard} from "./common/guard/RoleGuard.guard";
import {ProductModule} from "./modules/product/product.module";
import {ProductTypeModule} from "./modules/product-type/product-type.module";
import {ConfigModule} from "@nestjs/config";
import {CacheModule} from "@nestjs/cache-manager";
import {JwtModule} from "./modules/jwt/jwt.module";
import {UserModule} from "./modules/user/user.module";
import {DatabaseConfigModule} from "./config/database/databaseConfig.module";
import {JwtConfigModule} from "./config/jwt/jwtConfig.module";
import {MailerConfigModule} from "./config/mailer/mailerConfig.module";

@Module({
    imports: [
        DatabaseConfigModule,
        JwtConfigModule,
        UserModule,
        ProductModule,
        ProductTypeModule,
        JwtModule,
        ConfigModule.forRoot({isGlobal: true}),
        MailerConfigModule,
        CacheModule.register({isGlobal: true})
    ],
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
export class AppModule {
}