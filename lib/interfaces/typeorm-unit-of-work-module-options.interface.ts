import { DataSource } from 'typeorm';


export interface ITypeormUnitOfWorkModuleOptions {
  dataSource: DataSource;
}
