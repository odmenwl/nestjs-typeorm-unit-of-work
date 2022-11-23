import { IsolationLevel} from "typeorm/driver/types/IsolationLevel";
import { EntityTarget, ObjectLiteral, Repository } from "typeorm";

import { ICommitResult} from "./commit-result.interface";


export interface IUnitOfWork {
  start(isolationLevel?: IsolationLevel): Promise<void>;
  commit<T = null>(fn: () => Promise<T> ): Promise<ICommitResult<T>>;
  rollback(): Promise<void>;
  getRepository<Entity extends ObjectLiteral>(target: EntityTarget<Entity>): Repository<Entity>;
}

