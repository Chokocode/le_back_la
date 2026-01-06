import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const SsoValue = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest<{ sso?: string }>();
    return req.sso ?? null;
  },
);
