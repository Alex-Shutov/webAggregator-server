import { MigrationInterface, QueryRunner } from "typeorm";

export class AlterTags1711918482351 implements MigrationInterface {
    name = 'AlterTags1711918482351'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" ADD "text" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "tags" DROP COLUMN "text"`);
    }

}
