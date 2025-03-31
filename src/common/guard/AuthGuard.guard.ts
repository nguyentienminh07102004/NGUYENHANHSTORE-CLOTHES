import {CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";
import {IS_PUBLIC_KEY} from "../decorator/Public.decorator";
import {Reflector} from "@nestjs/core";
import {JwtAppService} from "../../modules/jwt/jwt.service";
import {JwtPayload} from "../../modules/jwt/dto/JwtPayload.dto";

@Injectable()
export class AuthGuard implements CanActivate {
    @Inject()
    private jwtService: JwtService;
    @Inject()
    private reflector: Reflector;
    @Inject()
    private jwtUserService: JwtAppService;

    async canActivate(context: ExecutionContext): Promise<boolean> {
        // lấy các metadata từ gần nhất đến xa nhất
        const isPublic: boolean = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);
        if (isPublic) {
            return true;
        }
        const request: Request = context.switchToHttp().getRequest();
        const [type, token] = request.headers.authorization?.split(" ") ?? [];
        if (!type || !type.startsWith("Bearer") || !token) {
            throw new UnauthorizedException();
        }
        let payload: JwtPayload | null = null;
        try {
            payload = await this.jwtService.verifyAsync<JwtPayload>(token);
        } catch {
            throw new UnauthorizedException();
        }
        if (!payload || !(await this.jwtUserService.findById(payload.jwtId))) {
            throw new UnauthorizedException();
        }
        return true;
    }
}