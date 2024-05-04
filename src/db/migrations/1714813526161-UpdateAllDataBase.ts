import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateAllDataBase1714813526161 implements MigrationInterface {
    name = 'UpdateAllDataBase1714813526161'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`DROP TABLE "teams_members_ids_users"`);
        // await queryRunner.query(`CREATE TABLE "teams_members_ids_users" ("teamsId" uuid NOT NULL, "usersId" uuid NOT NULL, CONSTRAINT "PK_a497f23b7faa28c72fc231a306a" PRIMARY KEY ("teamsId", "usersId"))`);
        // await queryRunner.query(`CREATE INDEX "IDX_9e8e113e458102df477eec9c36" ON "teams_members_ids_users" ("teamsId") `);
        // await queryRunner.query(`CREATE INDEX "IDX_1694bbd187aa0e235da0a68ebc" ON "teams_members_ids_users" ("usersId") `);
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_9e8e113e458102df477eec9c36c" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_1694bbd187aa0e235da0a68ebcd" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_1694bbd187aa0e235da0a68ebcd"`);
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_9e8e113e458102df477eec9c36c"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_1694bbd187aa0e235da0a68ebc"`);
        // await queryRunner.query(`DROP INDEX "public"."IDX_9e8e113e458102df477eec9c36"`);
        // await queryRunner.query(`DROP TABLE "teams_members_ids_users"`);
    }

}
