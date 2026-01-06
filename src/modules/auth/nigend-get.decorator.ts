import { applyDecorators, UseGuards } from '@nestjs/common';
import { RefGendarmeGuard } from '../guards/ref-gendarme.guard';

export function NigendGetProtected() {
  return applyDecorators(UseGuards(RefGendarmeGuard));
}
