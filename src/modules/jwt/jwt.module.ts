import { Module } from '@nestjs/common';
import { JwtAppService } from "./jwt.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtEntity } from "../../entity/jwt.entity";

@Module({
    imports: [TypeOrmModule.forFeature([JwtEntity])],
    providers: [JwtAppService],
    controllers: [],
    exports: [JwtAppService],
})
export class JwtModule {
}
