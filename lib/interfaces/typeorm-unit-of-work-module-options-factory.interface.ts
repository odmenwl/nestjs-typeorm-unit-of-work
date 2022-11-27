import { ITypeormUnitOfWorkModuleOptions } from './typeorm-unit-of-work-module-options.interface';

export interface ITypeormUnitOfWorkModuleOptionsFactory {
  createOptions(): Promise<ITypeormUnitOfWorkModuleOptions> | ITypeormUnitOfWorkModuleOptions;
}
