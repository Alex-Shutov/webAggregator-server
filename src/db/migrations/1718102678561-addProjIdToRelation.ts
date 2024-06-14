import { MigrationInterface, QueryRunner } from "typeorm";

export class AddProjIdToRelation1718102678561 implements MigrationInterface {
    name = 'AddProjIdToRelation1718102678561'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "UQ_9f03fd857a6f5401abaa1f1ae71" UNIQUE ("projectId")`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_9f03fd857a6f5401abaa1f1ae71" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_9f03fd857a6f5401abaa1f1ae71"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "UQ_9f03fd857a6f5401abaa1f1ae71"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "projectId"`);
    }

}
