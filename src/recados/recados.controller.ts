import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/uptadte-recado.dto';
import { RecadosService } from './recados.service';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosServices: RecadosService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  async findAll(@Query() paginationDto: PaginationDto) {
    const recados = await this.recadosServices.findAll(paginationDto);
    return recados;
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const recado = await this.recadosServices.findOne(id);
    return recado;
  }

  @Post()
  create(@Body() createBodyDto: CreateRecadoDto) {
    return this.recadosServices.create(createBodyDto);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBodyDto: UpdateRecadoDto,
  ) {
    return this.recadosServices.uptade(id, updateBodyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recadosServices.remove(id);
  }
}
