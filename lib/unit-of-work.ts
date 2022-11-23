import { Injectable } from "@nestjs/common";
import { DataSource, EntityTarget, ObjectLiteral, QueryRunner, ReplicationMode, Repository } from "typeorm";
import { InjectDataSource } from "@nestjs/typeorm";
import { IsolationLevel } from "typeorm/driver/types/IsolationLevel";

import { ICommitResult, IUnitOfWork } from "./interfaces";


@Injectable()
export class UnitOfWork implements IUnitOfWork {
  private readonly queryRunner: QueryRunner;

  constructor (
    @InjectDataSource() private readonly dataSource: DataSource,
    private mode?: ReplicationMode,
  ) {
    this.queryRunner = this.dataSource.createQueryRunner(mode);
  }

  public getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity> {
    return this.queryRunner.manager.getRepository(target);
  }

  public async start (isolationLevel?: IsolationLevel): Promise<void> {
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
}
