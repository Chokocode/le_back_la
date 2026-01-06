import { applyDecorators, UseGuards } from '@nestjs/common';
import { SsoGetGuard } from '../guards/sso-get.guard';

export function SsoGetProtected() {
  return applyDecorators(UseGuards(SsoGetGuard));
}
