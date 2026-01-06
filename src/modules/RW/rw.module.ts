import { Module } from '@nestjs/common';
import { RwService } from './rw.service';
import { RwController } from './rw.controller';
import { BddModule } from '../BDD/bdd.module';

import { SsoGetGuard } from '../guards/sso-get.guard';
import { ApiKeyGuard } from '../guards/api-key.guard';
import { RefGendarmeGuard } from '../guards/ref-gendarme.guard';
import { RefGendarmeController } from './ref-gendarme.controller';

@Module({
  imports: [BddModule],
  controllers: [RwController, RefGendarmeController],
  providers: [RwService, SsoGetGuard, ApiKeyGuard, RefGendarmeGuard],
})
export class RwModule {}