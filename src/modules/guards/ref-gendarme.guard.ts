import {
  Injectable,
  CanActivate,
  ExecutionContext,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import type { RequestWithUser } from '../auth/request-with-user';
import { BddService } from '../BDD/bdd.service';

@Injectable()
export class RefGendarmeGuard implements CanActivate {
  private readonly logger = new Logger(RefGendarmeGuard.name);

  constructor(private readonly bddService: BddService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const token = req.headers?.authorization as string | undefined;

    if (!token) {
      throw new UnauthorizedException('Missing Authorization header');
    }

    const trimmed = token.trim();

    if (!/^\d+$/.test(trimmed)) {
      throw new UnauthorizedException('Authorization must be a nigend number');
    }

    const nigend = Number(trimmed);
    if (!Number.isSafeInteger(nigend)) {
      throw new UnauthorizedException('Invalid nigend');
    }

    const user = this.bddService.getGendarmeByNigend(nigend);
    if (!user) {
      throw new UnauthorizedException('Unknown nigend');
    }

    req.user = user;
    this.logger.log(`GET autorisé pour ${user.nom} (nigend=${user.nigend})`);

    return true;
  }
}