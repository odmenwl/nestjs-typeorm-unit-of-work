import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class EmployeeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  yearlyIncomes: number;
}
