import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/uptadte-recado.dto';
import { RecadosService } from './recados.service';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosServices: RecadosService) { }

  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosServices.findAll(paginationDto);
    return recados;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    const recado = await this.recadosServices.findOne(id);
    return recado;
  }

  @Post()
  create(@Body() createBodyDto: CreateRecadoDto) {
    return this.recadosServices.create(createBodyDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateBodyDto: UpdateRecadoDto) {
    return this.recadosServices.uptade(id, updateBodyDto);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.recadosServices.remove(id);
  }
}
