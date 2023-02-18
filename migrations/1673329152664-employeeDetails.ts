import { MigrationInterface, QueryRunner } from "typeorm";

export class employeeDetails1673329152664 implements MigrationInterface {
    name = 'employeeDetails1673329152664'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD "created_at" datetime2 NOT NULL CONSTRAINT "DF_619ab9aac93a1af8cf95636a77f" DEFAULT getdate()
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD "last_updated" datetime2 NOT NULL CONSTRAINT "DF_b92f9f1d9b5b4e34d0d24b1161e" DEFAULT getdate()
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP CONSTRAINT "DF_b92f9f1d9b5b4e34d0d24b1161e"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP COLUMN "last_updated"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP CONSTRAINT "DF_619ab9aac93a1af8cf95636a77f"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP COLUMN "created_at"
        `);
    }

}
