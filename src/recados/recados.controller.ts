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
import { RecadosService } from './recados.service';
import { CreateRecadoDto } from './dto/create-recado-dto';
import { UpdateRecadoDto } from './dto/uptadte-recado-dto';

@Controller('recados')
export class RecadosController {
  constructor(private readonly recadosServices: RecadosService) {}
  @HttpCode(HttpStatus.OK)
  @Get()
  findAll(@Query() pagination: any) {
    console.log(pagination);
    return this.recadosServices.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recadosServices.findOne(id);
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
