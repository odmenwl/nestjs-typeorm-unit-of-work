import { BaseTransaction } from '../../../dist';
import { EmployeeEntity } from '../entities';
import { DeepPartial } from 'typeorm';
import { Injectable } from '@nestjs/common';

interface Input {
  transactionIncomes: number;
  data: DeepPartial<EmployeeEntity>;
}

@Injectable()
export class ExampleTransaction extends BaseTransaction<Input, number> {
  protected async func({ transactionIncomes, data }: Input): Promise<number> {
    const employeeRepository = await this.unitOfWork.getRepository<EmployeeEntity>(EmployeeEntity);

    const employee = await employeeRepository.save(data);

    await employeeRepository.update(employee.id, {
      yearlyIncomes: employee.yearlyIncomes + transactionIncomes,
    });

    return employee.id;
  }
}
