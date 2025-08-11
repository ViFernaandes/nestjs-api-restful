import { Module } from '@nestjs/common';
import { ConfigModule, ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GlobalConfigModule } from 'src/global-config/global-config.module';
import { PessoasModule } from 'src/pessoas/pessoas.module';
import { RecadosModule } from 'src/recados/recados.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import globalConfig from 'src/global-config/global.config';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConfigModule.forFeature(globalConfig),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(globalConfig)],
      inject: [globalConfig.KEY],
      useFactory: async (
        globalConfigurations: ConfigType<typeof globalConfig>,
      ) => {
        return {
          type: globalConfigurations.database.type,
          host: globalConfigurations.database.host,
          port: globalConfigurations.database.port,
          username: globalConfigurations.database.username,
          database: globalConfigurations.database.database,
          password: globalConfigurations.database.password,
          autoLoadEntities: globalConfigurations.database.autoLoadEntities,
          synchronize: globalConfigurations.database.synchronize,
        };
      },
    }),
    RecadosModule,
    PessoasModule,
    GlobalConfigModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
