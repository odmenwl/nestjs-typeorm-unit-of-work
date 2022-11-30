import { UnitOfWork } from './unit-of-work';
import { ICommitResult } from './interfaces';
import { Injectable } from '@nestjs/common';
import { InjectTypeormUnitOfWork } from './decorators';
import { TypeormUnitOfWorkBaseTransactionException } from './exceptions';

@Injectable()
export class BaseTransaction<TInput, TResult> {
  constructor(
    @InjectTypeormUnitOfWork() protected readonly unitOfWork: UnitOfWork
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected func(data: TInput): Promise<TResult> {
    throw new TypeormUnitOfWorkBaseTransactionException();
  }

  public async do(data: TInput): Promise<ICommitResult<TResult>> {
    await this.unitOfWork.start();

    return this.unitOfWork.commit<TResult>(() => this.func(data));
  }
}
