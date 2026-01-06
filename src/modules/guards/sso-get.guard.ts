import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SsoGetGuard implements CanActivate {
  private readonly logger = new Logger(SsoGetGuard.name);

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<any>();
    const token = req.headers?.authorization as string | undefined;

    const prefix = this.config.get<string>('SSO_PREFIX') ?? 'sso_nigend';

    // attendu: `${prefix}<digits>` ex: sso_nigend42
    const re = new RegExp(`^${prefix}(\\d+)$`);
    const match = token?.match(re);

    if (!match) {
      throw new ForbiddenException('Invalid SSO token for GET routes');
    }

    const ssoNumber = Number(match[1]);
    if (!Number.isFinite(ssoNumber)) {
      throw new ForbiddenException('SSO number is not valid');
    }

    // on attache des infos au req si tu veux les exploiter plus tard
    req.sso = token;
    req.ssoNumber = ssoNumber;

    this.logger.log(`SSO(GET) accepted: ${token} (num=${ssoNumber})`);
    return true;
  }
}
