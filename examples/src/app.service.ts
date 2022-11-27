import { Injectable } from '@nestjs/common';
import { EmployeeEntity } from './entities';
import { UnitOfWork, InjectTypeormUnitOfWork } from '../../dist';


@Injectable()
export class AppService {
  constructor(
    @InjectTypeormUnitOfWork() private readonly unitOfWork: UnitOfWork,
  ) {
  }

  async example (): Promise<number> {
    await this.unitOfWork.start();

    const employeeRepository = await this.unitOfWork.getRepository<EmployeeEntity>(EmployeeEntity);

    const {
      isSuccess,
      data: employeeId,
    } = await this.unitOfWork.commit<number>(
      async () => {
        const employee = await employeeRepository.save({
          firstName: 'firstName',
          lastName: 'lastName',
          yearlyIncomes: 100,
        });

        await employeeRepository.update(employee.id, {
          yearlyIncomes: employee.yearlyIncomes + 100,
        })

        return employee.id;
      }
    )

    return employeeId;
  }
}
