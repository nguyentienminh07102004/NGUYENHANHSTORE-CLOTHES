import {CanActivate, ExecutionContext, Injectable, UnauthorizedException} from "@nestjs/common";
import {JwtService} from "@nestjs/jwt";
import {Request} from "express";
import {IS_PUBLIC_KEY} from "../Decorator/Public.decorator";
import {Reflector} from "@nestjs/core";

@Injectable()
export class AuthGuard implements CanActivate {
	constructor(private jwtService: JwtService, private reflector: Reflector) {}
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
		try {
			request['user'] = await this.jwtService.verifyAsync(token);
		} catch {
			throw new UnauthorizedException();
		}
		return true;
	}
}