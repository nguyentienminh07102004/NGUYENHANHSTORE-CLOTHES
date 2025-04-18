import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    Inject,
    Param,
    ParseUUIDPipe,
    Post,
    Put,
    Query,
    Req
} from "@nestjs/common";
import {Public} from "../../common/decorator/Public.decorator";
import {ApiResponse} from "@nestjs/swagger";
import {APIResponse} from "../../DTO/APIResponse.dto";
import {UserResponse} from "./dto/UserResponse.dto";
import {UserService} from "./user.service";
import {UserRegister} from "./dto/UserRegister.dto";
import {JwtResponse} from "../jwt/dto/JwtResponse.dto";
import {UserLogin} from "./dto/UserLogin.dto";
import {UserChangePassword} from "./dto/UserChangePassword.dto";
import {Roles} from "../../common/decorator/Roles.decorator";
import {Role} from "../../common/enum/Role.enum";
import {UserEntity} from "../../entity/user.entity";
import {ParseEmailPipe} from "../../common/pipe/ParseEmailPipe.pipe";
import {UserForgotPassword} from "./dto/UserForgotPassword.dto";
import {UserLoginGoogle} from "./dto/UserLoginGoogle.dto";
import {Request} from "express";
import {ProductFavouriteEntity} from "../../entity/product-favourite.entity";

@Controller('users')
export class UserController {
    @Inject()
    private userService: UserService;

    @Public()
    @Post('register')
    @HttpCode(201)
    @ApiResponse({type: APIResponse<UserResponse>, description: 'Register user'})
    async save(@Body() userRegister: UserRegister): Promise<APIResponse<UserResponse>> {
        const user = await this.userService.save(userRegister);
        return {
            status: 201,
            message: "SUCCESS",
            data: user
        };
    }

    @Public()
    @Post('login')
    @HttpCode(200)
    @ApiResponse({type: APIResponse<JwtResponse>, description: 'Login user'})
    async login(@Body() userLogin: UserLogin): Promise<APIResponse<JwtResponse>> {
        const jwtResponse = await this.userService.login(userLogin);
        return {
            status: 200,
            message: "SUCCESS",
            data: jwtResponse
        };
    }

    @Put('change-password')
    @HttpCode(200)
    @ApiResponse({type: APIResponse<UserResponse>, description: 'Change password'})
    async changePassword(@Body() userChangePassword: UserChangePassword, @Req() req: Request): Promise<APIResponse<UserResponse>> {
        const user = await this.userService.changePassword(userChangePassword, req["user"].sub as string);
        return {
            status: 200,
            message: "SUCCESS",
            data: user
        };
    }

    @Get()
    @Roles(Role.ADMIN)
    @HttpCode(200)
    async findAll(): Promise<UserEntity[]> {
        return await this.userService.findAll();
    }

    @Post("forgot-password")
    @Public()
    @HttpCode(200)
    @ApiResponse({type: APIResponse<void>, description: "Send Email Forgot Password"})
    async forgotPassword(@Query("email", ParseEmailPipe) email: string): Promise<APIResponse<void>> {
        await this.userService.sendEmailForgotPassword(email);
        return {
            status: 200,
            message: "SUCCESS"
        };
    }

    @Put("forgot-password")
    @Public()
    @HttpCode(200)
    @ApiResponse({type: APIResponse<UserResponse>, description: "Verify Forgot Password"})
    async verifyForgotPassword(@Body() userForgotPassword: UserForgotPassword): Promise<APIResponse<UserResponse>> {
        const user = await this.userService.verifyCodeForgotPassword(userForgotPassword);
        return {
            status: 200,
            message: "SUCCESS",
            data: user
        };
    }

    @Post('login/google')
    @Public()
    @HttpCode(200)
    @ApiResponse({type: APIResponse<JwtResponse>, description: "Login with Google"})
    async loginGoogle(@Body() userLoginGoogle: UserLoginGoogle): Promise<APIResponse<JwtResponse>> {
        const jwtResponse: JwtResponse = await this.userService.loginGoogle(userLoginGoogle);
        return {
            status: 200,
            message: "SUCCESS",
            data: jwtResponse
        };
    }

    @Get('favourites')
    @HttpCode(200)
    @Roles(Role.USER)
    async findAllFavourites(@Req() req: Request) {
        const productFavourites = await this.userService.findAllProductFavourites(req['user']['sub']);
        const response: APIResponse<ProductFavouriteEntity[]> = {
            status: 200,
            message: "SUCCESS",
            data: productFavourites
        };
        return response;
    }

    @Post('like-product/:productId')
    @Roles(Role.USER)
    @HttpCode(200)
    async likeProduct(@Req() req: Request, @Param('productId', ParseUUIDPipe) productId: string) {
        await this.userService.likeProduct(req['user'].sub, productId);
        const response: APIResponse<null> = {
            status: 200,
            message: "SUCCESS"
        }
        return response;
    }

    @Delete('unlike-product/:productId')
    @HttpCode(200)
    @Roles(Role.USER)
    async unlikeProduct(@Req() req: Request, @Param('productId', ParseUUIDPipe) productId: string) {
        await this.userService.unlikeProduct(req['user'].sub, productId);
        const response: APIResponse<null> = {
            status: 200,
            message: "SUCCESS"
        }
        return response;
    }
}