import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPatronymic1717445251658 implements MigrationInterface {
    name = 'AddPatronymic1717445251658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "patronymic" character varying`);
        await queryRunner.query(`CREATE INDEX "IDX_c1627e902bdfff0f21d00e4ba2" ON "projects_categories_categories" ("categoriesId") `);
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" ADD CONSTRAINT "FK_c1627e902bdfff0f21d00e4ba25" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_categories_categories" DROP CONSTRAINT "FK_c1627e902bdfff0f21d00e4ba25"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1627e902bdfff0f21d00e4ba2"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "patronymic"`);
    }

}
