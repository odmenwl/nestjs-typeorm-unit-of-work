import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDataSourceToken, TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EmployeeEntity } from './entities';
import { DataSource } from 'typeorm';
import {
  TypeormUnitOfWorkModule,
  ITypeormUnitOfWorkModuleOptions,
} from '../../dist';
import { ExampleTransaction } from './transactions/example.transaction';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: Number(configService.getOrThrow('DB_PORT')),
        username: configService.getOrThrow('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.getOrThrow('DB_DATABASE'),
        entities: [EmployeeEntity],
      }),
    }),
    TypeormUnitOfWorkModule.forRootAsync({
      inject: [getDataSourceToken()],
      useFactory: (
        dataSource: DataSource,
      ): ITypeormUnitOfWorkModuleOptions => ({
        dataSource,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ExampleTransaction,
  ],
})
export class AppModule {}
