import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateStructure1713603691798 implements MigrationInterface {
    name = 'UpdateStructure1713603691798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2f789e58a882d8dd5b936c747c2"`);
        await queryRunner.query(`CREATE TABLE "project_ratings" ("userId" uuid NOT NULL DEFAULT uuid_generate_v4(), CONSTRAINT "PK_c2bb7663c6e08b8296abe6ddc57" PRIMARY KEY ("userId"))`);
        await queryRunner.query(`CREATE TABLE "teams_members_users" ("teamsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_b99b639496cf2aaf6a866e3609d" PRIMARY KEY ("teamsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7669600fb5620861e64df6be12" ON "teams_members_users" ("teamsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_309874039d297b30d077d16ae7" ON "teams_members_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "rated_events_users_ids" ("users" uuid NOT NULL, "events" uuid NOT NULL, CONSTRAINT "PK_7144530459f25a63cab5a00f5d6" PRIMARY KEY ("users", "events"))`);
        await queryRunner.query(`CREATE INDEX "IDX_35aa4c8c7bf8e271d41ef14042" ON "rated_events_users_ids" ("users") `);
        await queryRunner.query(`CREATE INDEX "IDX_8a4b04a59f93630b897644f5cb" ON "rated_events_users_ids" ("events") `);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "teamId"`);
        await queryRunner.query(`CREATE TYPE "public"."events_status_enum" AS ENUM('ON', 'OFF')`);
        await queryRunner.query(`ALTER TABLE "events" ADD "status" "public"."events_status_enum" NOT NULL DEFAULT 'ON'`);
        await queryRunner.query(`CREATE TYPE "public"."projects_status_enum" AS ENUM('draft', 'check', 'approved', 'declined')`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "status" "public"."projects_status_enum" NOT NULL DEFAULT 'draft'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "teamsId" uuid`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('ADMIN', 'STUDENT')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'STUDENT'`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_37c34adc5e9a29985d1f1710c28" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams_members_users" ADD CONSTRAINT "FK_7669600fb5620861e64df6be125" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "teams_members_users" ADD CONSTRAINT "FK_309874039d297b30d077d16ae76" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "FK_35aa4c8c7bf8e271d41ef140429" FOREIGN KEY ("users") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "FK_8a4b04a59f93630b897644f5cbc" FOREIGN KEY ("events") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects_members_users" DROP CONSTRAINT "FK_4e4776c9ce3de6c7aa5f7d09c39"`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" DROP CONSTRAINT "FK_f12d2be7201e8079ff063745da5"`);
        await queryRunner.query(`ALTER TABLE "teams_projects_projects" DROP CONSTRAINT "FK_97512337f70978d88beaba4f311"`);
        await queryRunner.query(`ALTER TABLE "teams_projects_projects" DROP CONSTRAINT "FK_6bd0f7b20091f830331bc41e52b"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2f789e58a882d8dd5b936c747c2"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_5ce96328534931bfee317799c91"`);
        await queryRunner.query(`ALTER TABLE "project_roles" DROP CONSTRAINT "FK_c289c4af5520c6aa2a41ddfe2e9"`);
        await queryRunner.query(`ALTER TABLE "project_roles" DROP CONSTRAINT "FK_94bb3752bfef052e9fe1b12d82a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "contacts"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "level"`);
        await queryRunner.query(`DROP TYPE "public"."users_level_enum"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "program"`);
        await queryRunner.query(`DROP TYPE "public"."users_program_enum"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4e4776c9ce3de6c7aa5f7d09c3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f12d2be7201e8079ff063745da"`);
        await queryRunner.query(`DROP TABLE "projects_members_users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_97512337f70978d88beaba4f31"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6bd0f7b20091f830331bc41e52"`);
        await queryRunner.query(`DROP TABLE "teams_projects_projects"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "events"`);
        await queryRunner.query(`DROP TABLE "project_roles"`);
        await queryRunner.query(`DROP TABLE "teams"`);
    }

}
