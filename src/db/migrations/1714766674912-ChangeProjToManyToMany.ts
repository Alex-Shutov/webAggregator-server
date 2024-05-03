import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeProjToManyToMany1714766674912 implements MigrationInterface {
    name = 'ChangeProjToManyToMany1714766674912'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_2fec10336297c7bb5282b5d3ce8"`);
        await queryRunner.query(`CREATE TABLE "projects_categories_categories" ("projectsId" uuid NOT NULL, "categoriesId" uuid NOT NULL, CONSTRAINT "PK_6ae14d8164d9cd9bf23145ca464" PRIMARY KEY ("projectsId", "categoriesId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9b247abd3635f4551bbbf94d24" ON "projects_categories_categories" ("projectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1627e902bdfff0f21d00e4ba2" ON "projects_categories_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_9b247abd3635f4551bbbf94d24d" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_c1627e902bdfff0f21d00e4ba25" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_c1627e902bdfff0f21d00e4ba25"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_9b247abd3635f4551bbbf94d24d"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "projectId" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1627e902bdfff0f21d00e4ba2"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b247abd3635f4551bbbf94d24"`);
        await queryRunner.query(`DROP TABLE "projects_categories_categories"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_2fec10336297c7bb5282b5d3ce8" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
