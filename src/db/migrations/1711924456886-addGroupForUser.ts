import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGroupForUser1711924456886 implements MigrationInterface {
    name = 'AddGroupForUser1711924456886'

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`ALTER TABLE "users" ADD "group" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "group"`);
    }

}
