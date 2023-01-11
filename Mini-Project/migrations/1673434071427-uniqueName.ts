import { MigrationInterface, QueryRunner } from "typeorm";

export class uniqueName1673434071427 implements MigrationInterface {
    name = 'uniqueName1673434071427'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "employee"
            ADD CONSTRAINT "UQ_e97a7f3c48c04b54ffc24e5fc71" UNIQUE ("name")
        `);
        await queryRunner.query(`
            ALTER TABLE "project"
            ADD CONSTRAINT "UQ_dedfea394088ed136ddadeee89c" UNIQUE ("name")
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "project" DROP CONSTRAINT "UQ_dedfea394088ed136ddadeee89c"
        `);
        await queryRunner.query(`
            ALTER TABLE "employee" DROP CONSTRAINT "UQ_e97a7f3c48c04b54ffc24e5fc71"
        `);
    }

}
