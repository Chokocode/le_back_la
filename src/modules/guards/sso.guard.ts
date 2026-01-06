import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class SsoGuard implements CanActivate {
  private readonly logger = new Logger(SsoGuard.name);
  private readonly expectedKey = 'sso_nigend';

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<any>();
    const token = req.headers?.authorization as string | undefined;

    if (!token || token !== this.expectedKey) {
      this.logger.warn('SSO rejected');
      throw new ForbiddenException('SSO header missing or invalid');
    }

    req.sso = token;
    this.logger.log(`SSO accepted`);
    return true;
  }
}
