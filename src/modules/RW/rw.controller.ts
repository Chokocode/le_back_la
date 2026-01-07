import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { RwService } from './rw.service';
import type { DataRow } from './rw.service';

import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

import { ApiKeyProtected } from '../auth/api-key.decorator';
import { NigendGetProtected } from '../auth/nigend-get.decorator';


export class CreateDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  value!: string;
}

export class UpsertDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  value!: string;
}

@Controller('rw')
export class RwController {
  constructor(private readonly rwService: RwService) {}

  // WRITE -> API KEY
  @ApiKeyProtected()
  @Post('data')
  create(@Body() body: CreateDto): DataRow {
    return this.rwService.create(body.value);
  }

  // WRITE -> API KEY
  @ApiKeyProtected()
  @Put('data/:key')
  upsert(
    @Param('key', ParseIntPipe) key: number,
    @Body() body: UpsertDto,
  ): DataRow {
    return this.rwService.upsert(key, body.value);
  }

  // GET -> NIGEND (ref_gendarme)
  @NigendGetProtected()
  @Get('data')
  findAll(): DataRow[] {
    return this.rwService.findAll();
  }

  // GET -> NIGEND (ref_gendarme)
  @NigendGetProtected()
  @Get('data/:key')
  findOne(@Param('key', ParseIntPipe) key: number): DataRow | null {
    return this.rwService.findOne(key);
  }

  // DELETE -> API KEY
  @ApiKeyProtected()
  @Delete('data/:key')
  delete(@Param('key', ParseIntPipe) key: number): { deleted: boolean } {
    return this.rwService.delete(key);
  }

  // ===== ref_gendarme =====

  // READ -> NIGEND (ref_gendarme)
  @NigendGetProtected()
  @Get('ref_gendarme')
  listGendarmes() {
    return this.rwService.listGendarmes();
  }

  // WRITE -> API KEY
  @ApiKeyProtected()
  @Post('ref_gendarme')
  createGendarme(
    @Body() body: { nigend: number; nom: string },
  ) {
    return this.rwService.insertGendarme(body.nigend, body.nom);
  }
  
}