import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateDbArchitecture1712270254600 implements MigrationInterface {
    name = 'CreateDbArchitecture1712270254600'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teams" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_7e5523774a38b08a6236d322403" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "project_roles" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "role" character varying NOT NULL, "userId" uuid, "projectId" uuid, CONSTRAINT "PK_8ac6a6996b6eaeae7b8fbb669f1" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "events" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_40731c7151fe4be3116e45ddf73" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "howToPlay" character varying NOT NULL, "gitLink" character varying NOT NULL, "screenshots" text NOT NULL, "rating" integer NOT NULL, "eventId" uuid, "teamId" uuid, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "teams_projects_projects" ("teamsId" uuid NOT NULL, "projectsId" uuid NOT NULL, CONSTRAINT "PK_9709c4df11ddba94c3bd4544c72" PRIMARY KEY ("teamsId", "projectsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6bd0f7b20091f830331bc41e52" ON "teams_projects_projects" ("teamsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_97512337f70978d88beaba4f31" ON "teams_projects_projects" ("projectsId") `);
        await queryRunner.query(`CREATE TABLE "projects_members_users" ("projectsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_43011a8c72d253c5efcf4c0a9fa" PRIMARY KEY ("projectsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_f12d2be7201e8079ff063745da" ON "projects_members_users" ("projectsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4e4776c9ce3de6c7aa5f7d09c3" ON "projects_members_users" ("usersId") `);
        await queryRunner.query(`CREATE TYPE "public"."users_program_enum" AS ENUM('09.03.01', '09.03.02', '09.03.03')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "program" "public"."users_program_enum" NOT NULL DEFAULT '09.03.01'`);
        await queryRunner.query(`CREATE TYPE "public"."users_level_enum" AS ENUM('2', '3', '4')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "level" "public"."users_level_enum" NOT NULL DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "users" ADD "contacts" character varying`);
        await queryRunner.query(`ALTER TABLE "project_roles" ADD CONSTRAINT "FK_94bb3752bfef052e9fe1b12d82a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_roles" ADD CONSTRAINT "FK_c289c4af5520c6aa2a41ddfe2e9" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_5ce96328534931bfee317799c91" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_2f789e58a882d8dd5b936c747c2" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams_projects_projects" ADD CONSTRAINT "FK_6bd0f7b20091f830331bc41e52b" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "teams_projects_projects" ADD CONSTRAINT "FK_97512337f70978d88beaba4f311" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" ADD CONSTRAINT "FK_f12d2be7201e8079ff063745da5" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "projects_members_users" ADD CONSTRAINT "FK_4e4776c9ce3de6c7aa5f7d09c39" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
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
