import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAndAddGradesCategories1714753970765 implements MigrationInterface {
    name = 'UpdateAndAddGradesCategories1714753970765'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_5ce96328534931bfee317799c91"`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "parentId" uuid, CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "grades" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "fires" integer NOT NULL DEFAULT '15', "projectId" character varying NOT NULL, "eventIdId" uuid, "userIdId" uuid, CONSTRAINT "PK_4740fb6f5df2505a48649f1687b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "subCategories" text`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "categoryId" uuid`);
        await queryRunner.query(`ALTER TABLE "events" ADD "finishDate" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "eventId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TYPE "public"."events_status_enum" RENAME TO "events_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('0', '1', '2', '3')`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" TYPE "public"."events_status_enum" USING "status"::"text"::"public"."events_status_enum"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT '1'`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "categories" ADD CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa" FOREIGN KEY ("parentId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_b7d7d44e0e33834351af221757d" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_ed857327d8c35e1c39cf5f9c758" FOREIGN KEY ("eventIdId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_b1068394edea46c66de85a09265" FOREIGN KEY ("userIdId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_b1068394edea46c66de85a09265"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_ed857327d8c35e1c39cf5f9c758"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_b7d7d44e0e33834351af221757d"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP CONSTRAINT "FK_9a6f051e66982b5f0318981bcaa"`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum_old" AS ENUM('ON', 'OFF')`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" TYPE "public"."events_status_enum_old" USING "status"::"text"::"public"."events_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'ON'`);
        await queryRunner.query(`DROP TYPE "public"."events_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."events_status_enum_old" RENAME TO "events_status_enum"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "eventId" uuid`);
        await queryRunner.query(`ALTER TABLE "events" DROP COLUMN "finishDate"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "categoryId"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "subCategories"`);
        await queryRunner.query(`DROP TABLE "grades"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_5ce96328534931bfee317799c91" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
