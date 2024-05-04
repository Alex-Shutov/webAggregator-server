import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPortfolio1714815458465 implements MigrationInterface {
    name = 'AddPortfolio1714815458465'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "teams_members_users"`);
        await queryRunner.query(`CREATE TABLE "teams_members_ids_users" ("teamsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_a497f23b7faa28c72fc231a306a" PRIMARY KEY ("teamsId", "usersId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_9e8e113e458102df477eec9c36" ON "teams_members_ids_users" ("teamsId") `);
        await queryRunner.query(`CREATE INDEX "IDX_1694bbd187aa0e235da0a68ebc" ON "teams_members_ids_users" ("usersId") `);
        await queryRunner.query(`CREATE TABLE "PortfolioTable" ("usersId" uuid NOT NULL, "projectsId" uuid NOT NULL, CONSTRAINT "PK_c84199a5eb3952404474e3ec54a" PRIMARY KEY ("usersId", "projectsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_caa5c6443a0bb53020d2a2b6ea" ON "PortfolioTable" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_cc84534ed1301f298f3eae3308" ON "PortfolioTable" ("projectsId") `);
        await queryRunner.query(`ALTER TABLE "projects" ADD "eventIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_2e2ae15d5efcd1e07ba97298ce5" UNIQUE ("eventIdId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "eventIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_2e2ae15d5efcd1e07ba97298ce5" FOREIGN KEY ("eventIdId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_57a4307c07ce7f849ce28e895ec" FOREIGN KEY ("eventIdId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_9e8e113e458102df477eec9c36c" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_1694bbd187aa0e235da0a68ebcd" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "PortfolioTable" ADD CONSTRAINT "FK_caa5c6443a0bb53020d2a2b6ea1" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "PortfolioTable" ADD CONSTRAINT "FK_cc84534ed1301f298f3eae33083" FOREIGN KEY ("projectsId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PortfolioTable" DROP CONSTRAINT "FK_cc84534ed1301f298f3eae33083"`);
        await queryRunner.query(`ALTER TABLE "PortfolioTable" DROP CONSTRAINT "FK_caa5c6443a0bb53020d2a2b6ea1"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_1694bbd187aa0e235da0a68ebcd"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_9e8e113e458102df477eec9c36c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_57a4307c07ce7f849ce28e895ec"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2e2ae15d5efcd1e07ba97298ce5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "eventIdId"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_2e2ae15d5efcd1e07ba97298ce5"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "eventIdId"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cc84534ed1301f298f3eae3308"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_caa5c6443a0bb53020d2a2b6ea"`);
        await queryRunner.query(`DROP TABLE "PortfolioTable"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1694bbd187aa0e235da0a68ebc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e8e113e458102df477eec9c36"`);
        await queryRunner.query(`DROP TABLE "teams_members_ids_users"`);
    }

}
