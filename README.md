# NestJS Typeorm Unit Of Work (Not stable)

Package for typeorm, which helps to realize "unit of work" pattern. 
Monorepo containing Nest module and example

# Installation
```bash
    npm i nestjs-typeorm-unit-of-work
```

# Documentation

```typescript
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.getOrThrow('DB_HOST'),
        port: Number(configService.getOrThrow('DB_PORT')),
        username: configService.getOrThrow('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.getOrThrow('DB_DATABASE'),
        entities: [EmployeeEntity],
      }),
    }),
    TypeormUnitOfWorkModule.forRootAsync({
      inject: [getDataSourceToken()],
      useFactory: (dataSource: DataSource): ITypeormUnitOfWorkModuleOptions => ({
        dataSource,
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

```typescript
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
```

