import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosModule } from 'src/recados/recados.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService, ConfigType } from '@nestjs/config';
import appConfig from './app.config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forFeature(appConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(appConfig)],
      inject: [appConfig.KEY],
      useFactory: async (appConfigurations: ConfigType<typeof appConfig>) => {
        return {
          type: appConfigurations.database.type,
          host: appConfigurations.database.host,
          port: appConfigurations.database.port,
          username: appConfigurations.database.username,
          database: appConfigurations.database.database,
          password: appConfigurations.database.password,
          autoloadentities: appConfigurations.database.autoLoadEntities,
          synchronize: appConfigurations.database.synchronize,
        };
      },
    }),
    RecadosModule,
    PessoasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
