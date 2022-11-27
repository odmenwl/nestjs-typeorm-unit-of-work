import { ModuleMetadata, Type } from '@nestjs/common';

import { ITypeormUnitOfWorkModuleOptions } from './typeorm-unit-of-work-module-options.interface';
import { ITypeormUnitOfWorkModuleOptionsFactory } from './typeorm-unit-of-work-module-options-factory.interface';


export interface ITypeormUnitOfWorkModuleAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<ITypeormUnitOfWorkModuleOptionsFactory>;
  useClass?: Type<ITypeormUnitOfWorkModuleOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<ITypeormUnitOfWorkModuleOptions> | ITypeormUnitOfWorkModuleOptions,
  inject?: any[];
  dataSourceName?: string;
  isGlobal?: boolean;
}
