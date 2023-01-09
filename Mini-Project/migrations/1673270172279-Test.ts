import { MigrationInterface, QueryRunner } from "typeorm";

export class Test1673270172279 implements MigrationInterface {
    name = 'Test1673270172279'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee"
            ADD "gender" nvarchar(255) NOT NULL
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee" DROP COLUMN "gender"
        `);
    }

}
