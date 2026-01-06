import { Module } from '@nestjs/common';
import { BddService } from './bdd.service';

@Module({
  providers: [BddService],
  exports: [BddService],
})
export class BddModule {}
