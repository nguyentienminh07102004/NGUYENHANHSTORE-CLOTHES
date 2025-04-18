import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { LessThan, Repository } from "typeorm";
import { JwtEntity } from "../../entity/jwt.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "../../entity/user.entity";
import { randomStringGenerator } from "@nestjs/common/utils/random-string-generator.util";
import { JwtService } from "@nestjs/jwt";
import { Role } from "../../common/enum/Role.enum";
import { v4 as uuid } from 'uuid';
import { JwtResponse } from "./dto/JwtResponse.dto";
import { JwtPayload } from "./dto/JwtPayload.dto";
import { ExceptionVariable } from "../../common/filters/HttpExceptionFilter.filter";
import { Cron } from "@nestjs/schedule";

@Injectable()
export class JwtAppService {
    @InjectRepository(JwtEntity)
    private jwtRepository: Repository<JwtEntity>;
    @Inject()
    private jwtService: JwtService;

    async findById(id: string): Promise<JwtEntity> {
        const jwt = await this.jwtRepository.findOneBy({ id: id });
        if (!jwt) {
            throw new NotFoundException(ExceptionVariable.JWT_NOT_FOUND);
        }
        return jwt;
    }

    async createJwtUser(user: UserEntity): Promise<JwtResponse> {
        const jwtId = uuid();
        const payload: JwtPayload = {
            jwtId: jwtId,
            sub: user.email,
            role: user.role || Role.USER,
        }
        const token = await this.jwtService.signAsync(payload);
        const jwt: JwtEntity = {
            id: jwtId,
            refreshToken: randomStringGenerator(),
            expireRefreshToken: new Date(Date.now() + 86400 * 1000 * 7),
            user: user
        };
        const jwtList = user.jwts;
        if (!jwtList || jwtList.length <= 0) {
            user.jwts = [jwt];
        } else {
            if (jwtList.length >= 5) {
                throw new BadRequestException(ExceptionVariable.ACCOUNT_LOGIN_MAX_DEVICE);
            }
            jwtList.push(jwt);
            user.jwts = jwtList;
        }
        return {
            id: jwt.id,
            token: token,
            refreshToken: jwt.refreshToken,
            refreshTokenExpires: jwt.expireRefreshToken
        };
    }

    @Cron("0 0 0 * * *", { timeZone: "Asia/Ho_Chi_Minh" })
    async deleteJwtExpire(): Promise<void> {
        await this.jwtRepository.delete({
            expireRefreshToken: LessThan(new Date())
        });
    }
}