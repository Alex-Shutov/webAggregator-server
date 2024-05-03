import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateCategories1714766362636 implements MigrationInterface {
    name = 'UpdateCategories1714766362636'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_b7d7d44e0e33834351af221757d"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "subCategories"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_2fec10336297c7bb5282b5d3ce8" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_2fec10336297c7bb5282b5d3ce8"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "subCategories" text`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_b7d7d44e0e33834351af221757d" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
