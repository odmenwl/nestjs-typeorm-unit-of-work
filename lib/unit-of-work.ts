import { Inject, Injectable, Scope } from '@nestjs/common';
import { EntityTarget, ObjectLiteral, QueryRunner, Repository } from 'typeorm';
import { IsolationLevel } from 'typeorm/driver/types/IsolationLevel';

import { ICommitResult, ITypeormUnitOfWorkModuleOptions, IUnitOfWork } from './interfaces';
import { TYPEORM_UNIT_OF_WORK_MODULE_OPTIONS } from './constants';


@Injectable({
  scope: Scope.REQUEST,
})
export class UnitOfWork implements IUnitOfWork {
  private _queryRunner: QueryRunner;

  private get queryRunner () {
    if (!this._queryRunner) {
      this.createRunner();
    }

    return this._queryRunner;
  }

  constructor (
    @Inject(TYPEORM_UNIT_OF_WORK_MODULE_OPTIONS) private readonly options: ITypeormUnitOfWorkModuleOptions,
  ) {
    this.createRunner();
  }

  public getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity> {
    return this.queryRunner.manager.getRepository(target);
  }

  public async start (isolationLevel?: IsolationLevel): Promise<void>
  {
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction(isolationLevel);
  }

  public async commit<T>(fn: () => Promise<T>): Promise<ICommitResult<T>> {
    const result: ICommitResult<T> = {
      isSuccess: false,
      data: null,
    };

    try {
      result.data = await fn();

      await this.queryRunner.commitTransaction();
      result.isSuccess = true;
    } catch (error) {
      await this.rollback();
      throw error;
    } finally {
      await this.dispose();
    }

    return result;
  }

  public async rollback () {
    await this.queryRunner.rollbackTransaction();
  }

  protected async dispose (): Promise<void> {
    await this.queryRunner.release();
  }

  private createRunner () {
    this._queryRunner = this.options.dataSource.createQueryRunner();
  }
}
