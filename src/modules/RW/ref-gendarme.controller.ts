import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiKeyProtected } from '../auth/api-key.decorator';
import { NigendGetProtected } from '../auth/nigend-get.decorator';
import { BddService } from '../BDD/bdd.service';

export class RefGendarmeDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  nom!: string;
}

@Controller('rw/ref_gendarme')
export class RefGendarmeController {
  constructor(private readonly bddService: BddService) {}

  // GET -> NIGEND (ref_gendarme)
  @NigendGetProtected()
  @Get()
  list(): { nigend: number; nom: string }[] {
    return this.bddService.listGendarmes();
  }

  // GET -> NIGEND (ref_gendarme)
  @NigendGetProtected()
  @Get(':nigend')
  getOne(@Param('nigend', ParseIntPipe) nigend: number): { nigend: number; nom: string } {
    const row = this.bddService.getGendarmeByNigend(nigend);
    if (!row) {
      throw new NotFoundException('Gendarme not found');
    }
    return row;
  }

  // WRITE -> API KEY
  @ApiKeyProtected()
  @Post(':nigend')
  create(
    @Param('nigend', ParseIntPipe) nigend: number,
    @Body() body: RefGendarmeDto,
  ): { nigend: number; nom: string } {
    return this.bddService.insertGendarme(nigend, body.nom);
  }

  // WRITE -> API KEY
  @ApiKeyProtected()
  @Put(':nigend')
  update(
    @Param('nigend', ParseIntPipe) nigend: number,
    @Body() body: RefGendarmeDto,
  ): { nigend: number; nom: string } {
    const row = this.bddService.updateGendarme(nigend, body.nom);
    if (!row) {
      throw new NotFoundException('Gendarme not found');
    }
    return row;
  }

  // WRITE -> API KEY
  @ApiKeyProtected()
  @Delete(':nigend')
  delete(@Param('nigend', ParseIntPipe) nigend: number): { deleted: boolean } {
    return this.bddService.deleteGendarme(nigend);
  }
}