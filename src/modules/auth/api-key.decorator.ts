import { applyDecorators, UseGuards } from '@nestjs/common';
import { ApiKeyGuard } from '../guards/api-key.guard';

export function ApiKeyProtected() {
  return applyDecorators(UseGuards(ApiKeyGuard));
}
