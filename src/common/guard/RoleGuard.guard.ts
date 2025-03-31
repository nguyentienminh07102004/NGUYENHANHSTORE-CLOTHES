import {CanActivate, ExecutionContext, Inject, Injectable} from '@nestjs/common';
import {Reflector} from '@nestjs/core';
import {ROLES_KEY} from "../decorator/Roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
    @Inject()
    private reflector: Reflector

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (!requiredRoles) {
            return true; // không đánh dấu
        }
        const {user} = context.switchToHttp().getRequest();
        return requiredRoles.includes(user.role);
    }
}
