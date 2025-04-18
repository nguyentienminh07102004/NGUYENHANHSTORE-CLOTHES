import { Module } from '@nestjs/common';
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./common/guard/AuthGuard.guard";
import { RolesGuard } from "./common/guard/RoleGuard.guard";
import { ProductModule } from "./modules/product/product.module";
import { ProductTypeModule } from "./modules/product-type/product-type.module";
import { ConfigModule } from "@nestjs/config";
import { CacheModule } from "@nestjs/cache-manager";
import { JwtModule } from "./modules/jwt/jwt.module";
import { UserModule } from "./modules/user/user.module";
import { DatabaseConfigModule } from "./configuration/database/DatabaseConfiguration.module";
import { ScheduleModule } from "@nestjs/schedule";
import { ProductFavouriteModule } from "./modules/product-favourites/product-favourite.module";
import { JwtConfigurationModule } from 'src/configuration/jwt/JwtConfiguration.module';
import { MailerConfigurationModule } from 'src/configuration/mailer/MailerConfiguration.module';

@Module({
    imports: [
        DatabaseConfigModule,
        JwtConfigurationModule,
        UserModule,
        ProductModule,
        ProductTypeModule,
        ProductFavouriteModule,
        JwtModule,
        ConfigModule.forRoot({ isGlobal: true }),
        MailerConfigurationModule,
        CacheModule.register({ isGlobal: true }),
        ScheduleModule.forRoot({})
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