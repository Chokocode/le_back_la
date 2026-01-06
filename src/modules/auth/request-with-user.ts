import type { Request } from 'express';
import type { User } from './user.model';

export type RequestWithUser = Request & {
  user?: User;
};