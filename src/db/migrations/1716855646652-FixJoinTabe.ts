import { MigrationInterface, QueryRunner } from "typeorm";

export class FixJoinTabe1716855646652 implements MigrationInterface {
    name = 'FixJoinTabe1716855646652'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_9b247abd3635f4551bbbf94d24d"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_9b247abd3635f4551bbbf94d24"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" RENAME COLUMN "projectsId" TO "projectId"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" RENAME CONSTRAINT "PK_6ae14d8164d9cd9bf23145ca464" TO "PK_4acf34cd65a3c2fdac0e8e0e2b2"`);
        await queryRunner.query(`CREATE INDEX "IDX_d04a8ac758932135f084238c43" ON "projects_categories_categories" ("projectId") `);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_d04a8ac758932135f084238c435" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_d04a8ac758932135f084238c435"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d04a8ac758932135f084238c43"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" RENAME CONSTRAINT "PK_4acf34cd65a3c2fdac0e8e0e2b2" TO "PK_6ae14d8164d9cd9bf23145ca464"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" RENAME COLUMN "projectId" TO "projectsId"`);
        await queryRunner.query(`CREATE INDEX "IDX_9b247abd3635f4551bbbf94d24" ON "projects_categories_categories" ("projectsId") `);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_9b247abd3635f4551bbbf94d24d" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
