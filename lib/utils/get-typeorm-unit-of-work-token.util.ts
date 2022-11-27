import { DEFAULT_DATA_SOURCE_NAME } from '@nestjs/typeorm/dist/typeorm.constants';

export function getTypeormUnitOfWorkToken (dataSourceName?: string): string {
  return dataSourceName ? `${dataSourceName}UnitOfWork` : DEFAULT_DATA_SOURCE_NAME;
}
