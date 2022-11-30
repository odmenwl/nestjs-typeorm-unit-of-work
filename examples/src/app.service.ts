import { Injectable, Logger } from '@nestjs/common';
import { EmployeeEntity } from './entities';
import { UnitOfWork, InjectTypeormUnitOfWork } from '../../dist';
import { ExampleTransaction } from './transactions/example.transaction';

@Injectable()
export class AppService {
  private readonly transactionData = {
    firstName: 'firstName',
    lastName: 'lastName',
    yearlyIncomes: 100,
  };
  private readonly transactionIncomes: number = 100;

  constructor(
    @InjectTypeormUnitOfWork() private readonly unitOfWork: UnitOfWork,
    private readonly exampleTransaction: ExampleTransaction,
  ) {}

  async example(): Promise<number> {
    await this.unitOfWork.start();

    const employeeRepository =
      await this.unitOfWork.getRepository<EmployeeEntity>(EmployeeEntity);

    const { isSuccess, data: employeeId } =
      await this.unitOfWork.commit<number>(async () => {
        const employee = await employeeRepository.save(this.transactionData);

        await employeeRepository.update(employee.id, {
          yearlyIncomes: employee.yearlyIncomes + this.transactionIncomes,
        });

        return employee.id;
      });

    if (isSuccess) {
      Logger.log(isSuccess);
    }

    return employeeId;
  }

  async example2(): Promise<number> {
    const {
      isSuccess,
      data: employeeId
    } = await this.exampleTransaction.do({
      data: this.transactionData,
      transactionIncomes: this.transactionIncomes,
    });

    if (isSuccess) {
      Logger.log(isSuccess);
    }

    return employeeId;
  }
}
