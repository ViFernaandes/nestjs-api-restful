import { Global, Module } from '@nestjs/common';
import { HashingServiceProtocol } from './hashing/hashing.service';
import { BcryptService } from './bcrypt.service';
import { AuthController } from './auth.controller';

@Global()
@Module({
  controllers: [AuthController],
  providers: [
    {
      provide: HashingServiceProtocol,
      useClass: BcryptService,
    },
  ],
  exports: [HashingServiceProtocol],
})
export class AuthModule { }
