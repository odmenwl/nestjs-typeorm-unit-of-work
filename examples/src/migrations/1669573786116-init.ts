import { MigrationInterface, QueryRunner } from "typeorm";

export class init1669573786116 implements MigrationInterface {
    name = 'init1669573786116'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "employee_entity" ("id" SERIAL NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "yearlyIncomes" integer NOT NULL, CONSTRAINT "PK_c82a9a0a7c05a72def0c72a68ab" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "employee_entity"`);
    }

}
