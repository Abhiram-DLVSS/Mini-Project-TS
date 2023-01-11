import { MigrationInterface, QueryRunner } from "typeorm";

export class addphno1673442340424 implements MigrationInterface {
    name = 'addphno1673442340424'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee_details"
            ADD "phno" nvarchar(10) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee_details" DROP COLUMN "phno"
        `);
    }

}
