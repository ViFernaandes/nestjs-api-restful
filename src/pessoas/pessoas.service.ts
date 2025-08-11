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
import { HashingServiceProtocol } from 'src/auth/hashing/hashing.service';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(Pessoa)
    private readonly pessoaRepository: Repository<Pessoa>,
    private readonly hashingService: HashingServiceProtocol,
  ) { }

  throwNewError() {
    throw new HttpException(
      'Pessoa não existe na base de dados.!',
      HttpStatus.NOT_FOUND,
    );
  }

  async create(createPessoaDto: CreatePessoaDto) {
    try {
      const passwordHash = await this.hashingService.hash(
        createPessoaDto.password,
      );

      const pessoasData = {
        nome: createPessoaDto.nome,
        passwordHash,
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
    const dadosPessoa = {
      nome: updatePessoaDto?.nome,
    };

    if (updatePessoaDto?.password) {
      const passwordHash = await this.hashingService.hash(
        updatePessoaDto.password,
      );

      dadosPessoa['passwordHash'] = passwordHash;
    }

    const pessoaExistente = await this.pessoaRepository.preload({
      id,
      ...dadosPessoa,
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
