import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PessoasService } from 'src/pessoas/pessoas.service';
import { Repository } from 'typeorm';
import { CreateRecadoDto } from './dto/create-recado.dto';
import { UpdateRecadoDto } from './dto/uptadte-recado.dto';
import { Recado } from './entities/recado.entity';

@Injectable()
export class RecadosService {
  constructor(
    @InjectRepository(Recado)
    private readonly recadoRepository: Repository<Recado>,
    private readonly pessoaService: PessoasService,
  ) { }

  throwNotFoundError() {
    throw new HttpException('Recado não encontrado', HttpStatus.NOT_FOUND);
  }

  async findAll() {
    const recados = await this.recadoRepository.find({
      relations: ['de', 'para'],
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });
    return recados;
  }

  async findOne(id: number) {
    const recado = await this.recadoRepository.findOne({
      where: {
        id,
      },
      relations: ['de', 'para'],
      select: {
        de: {
          id: true,
          nome: true,
        },
        para: {
          id: true,
          nome: true,
        },
      },
    });

    if (recado) return recado;

    this.throwNotFoundError();
  }

  async create(createRecadoDto: CreateRecadoDto) {
    const { deId, paraId } = createRecadoDto;

    const de = await this.pessoaService.findOne(deId);
    const para = await this.pessoaService.findOne(paraId);

    const novoRecado = {
      texto: createRecadoDto.texto,
      de,
      para,
      lido: false,
      data: new Date(),
    };

    const recado = await this.recadoRepository.create(novoRecado);
    await this.recadoRepository.save(recado);

    return {
      ...recado,
      de: { id: recado.de.id },
      para: { id: recado.para.id },
    };
  }

  async uptade(id: number, updateRecadoDto: UpdateRecadoDto) {
    const partialUpdateRecadoDto = {
      lido: updateRecadoDto?.lido,
      texto: updateRecadoDto?.texto,
    };

    const recadoExistente = await this.recadoRepository.preload({
      id,
      ...partialUpdateRecadoDto,
    });

    if (!recadoExistente) return this.throwNotFoundError();

    return this.recadoRepository.save(recadoExistente);
  }

  async remove(id: number) {
    const recado = await this.recadoRepository.findOneBy({
      id,
    });

    if (!recado) return this.throwNotFoundError();

    return this.recadoRepository.remove(recado);
  }
}
