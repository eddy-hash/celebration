import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) throw new ForbiddenException('Not authenticated');
    if (!['admin', 'super_admin'].includes(req.user.role)) {
      throw new ForbiddenException('Admin only');
    }
    return true;
  }
}
