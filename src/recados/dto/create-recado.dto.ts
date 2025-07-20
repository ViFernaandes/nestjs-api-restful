import { IsNotEmpty, IsString, IsPositive } from 'class-validator';

export class CreateRecadoDto {
  @IsString()
  @IsNotEmpty()
  readonly texto: string;

  @IsPositive()
  deId: number;

  @IsPositive()
  paraId: number;
}
