import { MigrationInterface, QueryRunner } from "typeorm";

export class salary1673441410391 implements MigrationInterface {
    name = 'salary1673441410391'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP CONSTRAINT "DF_43ab4dcae85f52ea3e53fa862e3"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP COLUMN "salary"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD "salary" decimal(12, 2) NOT NULL CONSTRAINT "DF_43ab4dcae85f52ea3e53fa862e3" DEFAULT 0
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP CONSTRAINT "DF_43ab4dcae85f52ea3e53fa862e3"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP COLUMN "salary"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD "salary" int NOT NULL
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD CONSTRAINT "DF_43ab4dcae85f52ea3e53fa862e3" DEFAULT 0 FOR "salary"
        `);
    }

}
