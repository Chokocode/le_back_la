import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { User } from './user.model';
import type { RequestWithUser } from './request-with-user';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User | undefined => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>();
    return req.user;
  },
);