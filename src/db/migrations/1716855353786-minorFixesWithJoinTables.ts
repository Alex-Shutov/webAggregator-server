import { MigrationInterface, QueryRunner } from "typeorm";

export class MinorFixesWithJoinTables1716855353786 implements MigrationInterface {
    name = 'MinorFixesWithJoinTables1716855353786'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_9b247abd3635f4551bbbf94d24d"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_c1627e902bdfff0f21d00e4ba25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9b247abd3635f4551bbbf94d24"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1627e902bdfff0f21d00e4ba2"`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "PK_6ae14d8164d9cd9bf23145ca464"`);
        // await queryRunner.query(` ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "PK_c1627e902bdfff0f21d00e4ba25" PRIMARY KEY ("categoriesId")`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP COLUMN "projectsId"`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "PK_c1627e902bdfff0f21d00e4ba25"`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP COLUMN "categoriesId"`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD "project" uuid NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "PK_5d344ad9695cb0c19877e7d49bb" PRIMARY KEY ("project")`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD "categories" uuid NOT NULL`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "PK_5d344ad9695cb0c19877e7d49bb"`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "PK_86ae534f9f097e57e3662831e6a" PRIMARY KEY ("project", "categories")`);
        // await queryRunner.query(`CREATE INDEX "IDX_5d344ad9695cb0c19877e7d49b" ON "projects_categories_categories" ("project") `);
        // await queryRunner.query(`CREATE INDEX "IDX_1da5c1ceba2d67207cd219becc" ON "projects_categories_categories" ("categories") `);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_5d344ad9695cb0c19877e7d49bb" FOREIGN KEY ("project") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_1da5c1ceba2d67207cd219beccc" FOREIGN KEY ("categories") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_1da5c1ceba2d67207cd219beccc"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_5d344ad9695cb0c19877e7d49bb"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1da5c1ceba2d67207cd219becc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5d344ad9695cb0c19877e7d49b"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "PK_86ae534f9f097e57e3662831e6a"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "PK_5d344ad9695cb0c19877e7d49bb" PRIMARY KEY ("project")`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP COLUMN "categories"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "PK_5d344ad9695cb0c19877e7d49bb"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP COLUMN "project"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD "categoriesId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "PK_c1627e902bdfff0f21d00e4ba25" PRIMARY KEY ("categoriesId")`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD "projectsId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "PK_c1627e902bdfff0f21d00e4ba25"`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "PK_6ae14d8164d9cd9bf23145ca464" PRIMARY KEY ("projectsId", "categoriesId")`);
        await queryRunner.query(`CREATE INDEX "IDX_c1627e902bdfff0f21d00e4ba2" ON "projects_categories_categories" ("categoriesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9b247abd3635f4551bbbf94d24" ON "projects_categories_categories" ("projectsId") `);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_c1627e902bdfff0f21d00e4ba25" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_9b247abd3635f4551bbbf94d24d" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
