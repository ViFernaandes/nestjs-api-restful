import { Module } from '@nestjs/common';
import { ConceitosManualModule } from 'src/conceitos-manual/conceitos-manual.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [ConceitosManualModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

