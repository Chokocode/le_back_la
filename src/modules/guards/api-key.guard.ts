import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  private readonly logger = new Logger(ApiKeyGuard.name);

  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<any>();
    const token = req.headers?.authorization as string | undefined;

    const expected = this.config.get<string>('API_KEY');
    if (!expected) {
      // Si pas de clé dans .env, on refuse tout (sécurité)
      throw new ForbiddenException('API_KEY is not configured');
    }

    if (!token || token !== expected) {
      throw new ForbiddenException('Invalid API key for write routes');
    }

    this.logger.log(`API_KEY accepted for WRITE route`);
    return true;
  }
}