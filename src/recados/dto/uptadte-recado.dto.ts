import { PartialType } from '@nestjs/mapped-types';
import { CreateRecadoDto } from './create-recado.dto';
import { IsBoolean } from 'class-validator';

export class UpdateRecadoDto extends PartialType(CreateRecadoDto) {
  @IsBoolean()
  readonly lido: boolean;
}
