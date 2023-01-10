import { MigrationInterface, QueryRunner } from "typeorm";

export class Salary1673345245264 implements MigrationInterface {
    name = 'Salary1673345245264'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD "salary" int NOT NULL CONSTRAINT "DF_43ab4dcae85f52ea3e53fa862e3" DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP CONSTRAINT "DF_43ab4dcae85f52ea3e53fa862e3"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP COLUMN "salary"
        `);
    }

}
