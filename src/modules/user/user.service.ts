import { BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/entity/user.entity";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { plainToInstance } from "class-transformer";
import { MailerService } from "@nestjs-modules/mailer";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { Cache, CACHE_MANAGER } from "@nestjs/cache-manager";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { lastValueFrom } from "rxjs";
import { UserRegister } from "./dto/UserRegister.dto";
import { UserResponse } from "./dto/UserResponse.dto";
import { UserLogin } from "./dto/UserLogin.dto";
import { JwtResponse } from "../jwt/dto/JwtResponse.dto";
import { UserChangePassword } from "./dto/UserChangePassword.dto";
import { UserForgotPassword } from "./dto/UserForgotPassword.dto";
import { JwtAppService } from "../jwt/jwt.service";
import { UserLoginGoogle } from "./dto/UserLoginGoogle.dto";
import { ExceptionVariable } from "../../common/filters/HttpExceptionFilter.filter";
import { ProductFavouriteService } from "../product-favourites/product-favourite.service";

@Injectable()
export class UserService {
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>;
    @Inject()
    private mailerService: MailerService;
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache;
    @Inject()
    private httpService: HttpService;
    @Inject()
    private configService: ConfigService;
    @Inject()
    private jwtUserService: JwtAppService;
    @Inject()
    private productFavouriteService: ProductFavouriteService;

    async save(userRegister: UserRegister): Promise<UserResponse> {
        if (userRegister._password !== userRegister._confirmPassword) {
            throw new BadRequestException(ExceptionVariable.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH);
        }
        if (await this.userRepository.existsBy({ email: userRegister.email })) {
            throw new BadRequestException(ExceptionVariable.EMAIL_HAS_EXISTS);
        }
        const user: UserEntity = plainToInstance<UserEntity, UserRegister>(UserEntity, userRegister, { excludePrefixes: ["_"] });
        user._password = await bcrypt.hash(userRegister._password, await bcrypt.genSalt());
        await this.userRepository.save(user);
        return plainToInstance<UserResponse, UserEntity>(UserResponse, user, { excludePrefixes: ["_"] });
    }

    async login(userLogin: UserLogin): Promise<JwtResponse> {
        const user: UserEntity | null = await this.userRepository.findOne({
            where: { email: userLogin.email },
            relations: ["jwts"]
        });
        if (user === null) {
            throw new UnauthorizedException(ExceptionVariable.EMAIL_PASSWORD_NOT_MATCH);
        }
        if (!userLogin.isSocial) {
            if (!userLogin.password) {
                throw new UnauthorizedException(ExceptionVariable.EMAIL_PASSWORD_NOT_MATCH);
            }
            if (!bcrypt.compareSync(userLogin.password, user._password)) {
                throw new UnauthorizedException(ExceptionVariable.EMAIL_PASSWORD_NOT_MATCH);
            }
        }
        const jwtResponse = await this.jwtUserService.createJwtUser(user);
        await this.userRepository.save(user);
        return jwtResponse;
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.userRepository.find();
    }

    async changePassword(userChangePassword: UserChangePassword, email: string) {
        const user: UserEntity | null = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new NotFoundException(ExceptionVariable.USER_NOT_FOUND);
        }
        if (!bcrypt.compareSync(userChangePassword.oldPassword, user._password)) {
            throw new BadRequestException(ExceptionVariable.OLD_PASSWORD_NEW_PASSWORD_NOT_MATCH);
        }
        if (userChangePassword.newPassword !== userChangePassword.confirmPassword) {
            throw new BadRequestException(ExceptionVariable.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH);
        }
        user._password = await bcrypt.hash(userChangePassword.newPassword, await bcrypt.genSalt());
        await this.userRepository.save(user);
        return plainToInstance<UserResponse, UserEntity>(UserResponse, user, { excludePrefixes: ["_"] });
    }

    async sendEmailForgotPassword(email: string) {
        const user: UserEntity | null = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new NotFoundException(ExceptionVariable.USER_NOT_FOUND);
        }
        const code = randomStringGenerator();
        await this.cacheManager.set(`forgotPassword:${code}`, { email: email, code: code }, 300 * 1000);
        await this.mailerService.sendMail({
            from: { name: "Nguyen Hanh Store", address: "nguyentienminh07102004@gmail.com" },
            to: email,
            subject: "FORGOT PASSWORD",
            template: "./ForgotPassword",
            context: {
                name: user.fullName || user.email,
                code: code
            }
        });
    }

    async verifyCodeForgotPassword(userForgotPassword: UserForgotPassword) {
        const code = userForgotPassword.code;
        const data = await this.cacheManager.get<{ code: string; email: string }>(`forgotPassword:${code}`);
        if (!data) {
            throw new BadRequestException(ExceptionVariable.CODE_INVALID);
        }
        const { email } = data;
        const user: UserEntity | null = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new NotFoundException(ExceptionVariable.USER_NOT_FOUND);
        }
        if (bcrypt.compareSync(userForgotPassword.newPassword, user._password)) {
            throw new BadRequestException(ExceptionVariable.OLD_PASSWORD_NEW_PASSWORD_NOT_MATCH);
        }
        if (userForgotPassword.newPassword !== userForgotPassword.confirmPassword) {
            throw new BadRequestException(ExceptionVariable.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH);
        }
        user._password = await bcrypt.hash(userForgotPassword.newPassword, await bcrypt.genSalt());
        await this.userRepository.save(user);
        await this.cacheManager.del(`forgotPassword:${code}`);
        return plainToInstance<UserResponse, UserEntity>(UserResponse, user, { excludePrefixes: ["_"] });
    }

    async loginGoogle(userLoginGoogle: UserLoginGoogle) {
        const res = await lastValueFrom(this.httpService.post("https://oauth2.googleapis.com/token", {
            "client_id": this.configService.get<string>("GOOGLE_CLIENT_ID"),
            "client_secret": this.configService.get<string>("GOOGLE_CLIENT_SECRET"),
            "redirect_uri": this.configService.get<string>("REDIRECT_URI"),
            "grant_type": "authorization_code",
            "code": userLoginGoogle.code,
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            }
        }));
        const { access_token } = res.data;
        const {
            email,
            picture,
            name
        } = (await lastValueFrom(this.httpService.get("https://www.googleapis.com/oauth2/v2/userinfo", {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        }))).data;
        if (await this.userRepository.existsBy({ email: email })) {
            return this.login({ email: email, isSocial: true });
        }
        const user: UserEntity = this.userRepository.create({
            email: email,
            fullName: name,
            avatar: picture,
            _password: await bcrypt.hash(randomStringGenerator(), await bcrypt.genSalt()),
        });

        const jwtResponse = await this.jwtUserService.createJwtUser(user);
        await this.userRepository.save(user);
        return jwtResponse;
    }

    async findAllProductFavourites(email: string) {
        return this.productFavouriteService.findAllProductFavouritesByEmail(email);
    }
    async findUserEntityByEmail(email: string) {
        const user = await this.userRepository.findOneBy({ email: email });
        if (!user) {
            throw new NotFoundException(ExceptionVariable.USER_NOT_FOUND);
        }
        return user;
    }
    async likeProduct(email: string, productId: string) {
        const user: UserEntity = await this.findUserEntityByEmail(email);
        return await this.productFavouriteService.saveFavourites(user, productId);
    }

    async unlikeProduct(email: string, productId: string) {
        const user: UserEntity = await this.findUserEntityByEmail(email);
        return await this.productFavouriteService.deleteFavourites(user, productId);
    }

    async findAllProductFavouritesByEmail(email: string) {
        await this.findUserEntityByEmail(email);
        return await this.productFavouriteService.findAllProductFavouritesByEmail(email);
    }
}