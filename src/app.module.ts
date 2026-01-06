import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BddModule } from './modules/BDD/bdd.module';
import { RwModule } from './modules/RW/rw.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    BddModule,
    RwModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
