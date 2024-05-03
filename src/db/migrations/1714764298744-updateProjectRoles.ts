import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProjectRoles1714764298744 implements MigrationInterface {
    name = 'UpdateProjectRoles1714764298744'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_37c34adc5e9a29985d1f1710c28"`);
        await queryRunner.query(`ALTER TABLE "projects" RENAME COLUMN "teamsId" TO "teamId"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_2f789e58a882d8dd5b936c747c2" UNIQUE ("teamId")`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_2f789e58a882d8dd5b936c747c2" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2f789e58a882d8dd5b936c747c2"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_2f789e58a882d8dd5b936c747c2"`);
        await queryRunner.query(`ALTER TABLE "projects" RENAME COLUMN "teamId" TO "teamsId"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_37c34adc5e9a29985d1f1710c28" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
