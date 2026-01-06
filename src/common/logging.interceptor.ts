import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

function maskAuthorization(value?: string): string {
  if (!value) return 'none';
  return value.length <= 4 ? '****' : '*'.repeat(value.length - 4) + value.slice(-4);
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest<any>();
    const res = context.switchToHttp().getResponse<any>();

    const method = req.method;
    const url = req.originalUrl ?? req.url;
    const auth = maskAuthorization(req.headers?.authorization);

    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          const ms = Date.now() - start;
          this.logger.log(`${method} ${url} ${res.statusCode} ${ms}ms auth=${auth}`);
        },
        error: (err) => {
          const ms = Date.now() - start;
          this.logger.error(`${method} ${url} ${res.statusCode} ${ms}ms auth=${auth}`);
        },
      }),
    );
  }
}
