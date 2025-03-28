import {Module} from "@nestjs/common";
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserController} from "src/Controller/user.controller";
import {UserEntity} from "src/Domains/user.entity";
import {UserService} from "src/Service/user.service";

@Module({
	imports: [TypeOrmModule.forFeature([UserEntity])],
	controllers: [UserController],
	providers: [UserService],
	exports: [],
})
export class UserModule {}