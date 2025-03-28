import {BadRequestException, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "src/Domains/user.entity";
import {UserLogin} from "src/DTO/User/UserLogin.dto";
import {UserRegister} from "src/DTO/User/UserRegister.dto";
import {Repository} from "typeorm";
import * as bcrypt from 'bcrypt';
import {ExceptionVariable} from "../Exception/ExceptionVariable";

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private usersRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ) {
    }

    save(userRegister: UserRegister) {
        if (userRegister.password !== userRegister.confirmPassword) {
            throw new BadRequestException(ExceptionVariable.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH);
        }
        return this.usersRepository.save({
            'email': userRegister.email,
            'fullName': userRegister.fullName,
            'password': bcrypt.hashSync(userRegister.password, 12),
            'role': userRegister.role,
            'phone': userRegister.phone
        })
    }

    async login(userLogin: UserLogin) {
        const user: UserEntity | null = await this.usersRepository.findOneBy({email: userLogin.email});
        if (user === null) {
            throw new UnauthorizedException(ExceptionVariable.EMAIL_PASSWORD_NOT_MATCH);
        }
        if (!bcrypt.compareSync(userLogin.password, user.password)) {
            throw new UnauthorizedException(ExceptionVariable.EMAIL_PASSWORD_NOT_MATCH);
        }
        return {'access_token': this.jwtService.sign({sub: user.email, role: user.role})};
    }

    async findAll(): Promise<UserEntity[]> {
        return await this.usersRepository.find();
    }
}