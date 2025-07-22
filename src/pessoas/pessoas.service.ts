import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { Pessoa } from './entities/pessoa.entity';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
  ) {}

  throwNewError() {
    throw new HttpException(
      'Pessoa não existe na base de dados.!',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const pessoasData = {
        nome: createPessoaDto.nome,
        passwordHash: createPessoaDto.password,
        email: createPessoaDto.email,
      };

      const novaPessoa = this.pessoaRepository.create(pessoasData);
      await this.pessoaRepository.save(novaPessoa);
      return novaPessoa;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('E-mail já está cadastrado.');
      }
      throw error;
    }
  }

  async findAll() {
    const pessoas = await this.pessoaRepository.find({
      order: {
        id: 'desc',
      },
    });
    return pessoas;
  }

  async findOne(id: number) {
    const pessoa = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!pessoa) {
      throw new NotFoundException('Pessoa não encontrada');
    }
    return pessoa;
  }

  async update(id: number, updatePessoaDto: UpdatePessoaDto) {
    const partialUpdatePessoaDto = {
      nome: updatePessoaDto?.nome,
      passwordHash: updatePessoaDto?.password,
    };

    const pessoaExistente = await this.pessoaRepository.preload({
      id,
      ...partialUpdatePessoaDto,
    });

    if (!pessoaExistente) return this.throwNewError();

    return this.pessoaRepository.save(pessoaExistente);
  }

  async remove(id: number) {
    const person = await this.pessoaRepository.findOneBy({
      id,
    });

    if (!person) {
      this.throwNewError();
    }

    return 'Pessoa removida com sucesso.!';
  }
}
