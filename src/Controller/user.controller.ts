import {Body, Controller, Get, Post} from "@nestjs/common";
import {UserLogin} from "src/DTO/User/UserLogin.dto";
import {UserRegister} from "src/DTO/User/UserRegister.dto";
import {UserService} from "src/Service/user.service";
import {Public} from "../Decorator/Public.decorator";
import {UserEntity} from "../Domains/user.entity";
import {Roles} from "../Decorator/Roles.decorator";
import {Role} from "../Bean/Role.enum";

@Controller('api/users')
export class UserController {
    constructor(private userService: UserService) {
    }

    @Public()
    @Post('register')
    save(@Body() userRegister: UserRegister) {
        return this.userService.save(userRegister);
    }

    @Public()
    @Post('login')
    login(@Body() userLogin: UserLogin) {
        return this.userService.login(userLogin);
    }

    @Get()
    @Roles(Role.ADMIN)
    async findAll(): Promise<UserEntity[]> {
        return await this.userService.findAll();
    }
}