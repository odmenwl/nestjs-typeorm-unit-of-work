import { DynamicModule, Module, Provider, Type } from '@nestjs/common';
import {
  ITypeormUnitOfWorkModuleAsyncOptions,
  ITypeormUnitOfWorkModuleOptionsFactory,
} from './interfaces';
import { BASE_TRANSACTION_PROVIDER_NAME, TYPEORM_UNIT_OF_WORK_MODULE_OPTIONS } from './constants';
import { UnitOfWork } from './unit-of-work';
import { getTypeormUnitOfWorkToken } from './utils';
import { BaseTransaction } from './base.transaction';

@Module({})
export class TypeormUnitOfWorkModule {
  public static forRootAsync(
    options: ITypeormUnitOfWorkModuleAsyncOptions,
  ): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    const unitOfWorkProvider: Provider = {
      provide: getTypeormUnitOfWorkToken(options.dataSourceName),
      useClass: UnitOfWork,
    };

    const abstractTransaction: Provider = {
      provide: BASE_TRANSACTION_PROVIDER_NAME,
      useClass: BaseTransaction,
    };

    return {
      global: options.isGlobal,
      module: TypeormUnitOfWorkModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        unitOfWorkProvider,
        abstractTransaction,
      ],
      exports: [
        unitOfWorkProvider,
        abstractTransaction,
      ],
    };
  }

  private static createAsyncProviders(
    options: ITypeormUnitOfWorkModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass =
      options.useClass as Type<ITypeormUnitOfWorkModuleOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: ITypeormUnitOfWorkModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: TYPEORM_UNIT_OF_WORK_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }

    const inject = [
      (options.useClass ||
        options.useExisting) as Type<ITypeormUnitOfWorkModuleOptionsFactory>,
    ];

    return {
      provide: TYPEORM_UNIT_OF_WORK_MODULE_OPTIONS,
      useFactory: async (
        optionsFactory: ITypeormUnitOfWorkModuleOptionsFactory,
      ) => {
        await optionsFactory.createOptions();
      },
      inject,
    };
  }
}
