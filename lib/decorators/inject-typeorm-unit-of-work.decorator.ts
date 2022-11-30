import { Inject } from '@nestjs/common';
import { getTypeormUnitOfWorkToken } from '../utils';

export const InjectTypeormUnitOfWork = (
  dataSourceName?: string,
): ParameterDecorator => Inject(getTypeormUnitOfWorkToken(dataSourceName));
