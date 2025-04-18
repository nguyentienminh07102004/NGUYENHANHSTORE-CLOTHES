import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { JwtModuleOptions } from "@nestjs/jwt/dist/interfaces/jwt-module-options.interface";

@Module({
    imports: [JwtModule.registerAsync({
        global: true,
        inject: [ConfigService],
        useFactory: (configService: ConfigService): JwtModuleOptions => ({
            signOptions: { expiresIn: "86400s", algorithm: "HS512" },
            secret: configService.get<string>("SECRET_KEY")
        })
    })]
})
export class JwtConfigurationModule { }