import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTeamMember1717954441911 implements MigrationInterface {
    name = 'AddTeamMember1717954441911'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_9e8e113e458102df477eec9c36c"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_1694bbd187aa0e235da0a68ebcd"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e8e113e458102df477eec9c36"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_1694bbd187aa0e235da0a68ebc"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "PK_a497f23b7faa28c72fc231a306a"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "PK_1694bbd187aa0e235da0a68ebcd" PRIMARY KEY ("usersId")`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP COLUMN "teamsId"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "PK_1694bbd187aa0e235da0a68ebcd"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP COLUMN "usersId"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD "teamId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "PK_ba3401012ad1a62c11d1a4bdfc6" PRIMARY KEY ("teamId")`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD "projectRole" character varying`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD "eventId" uuid`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_ba3401012ad1a62c11d1a4bdfc6" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_9e33639ece8989dc1274153085f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_a2661ed02e0c4eb9fbe35a28807" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_a2661ed02e0c4eb9fbe35a28807"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_9e33639ece8989dc1274153085f"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_ba3401012ad1a62c11d1a4bdfc6"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP COLUMN "projectRole"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "PK_ba3401012ad1a62c11d1a4bdfc6"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD "usersId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "PK_1694bbd187aa0e235da0a68ebcd" PRIMARY KEY ("usersId")`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD "teamsId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "PK_1694bbd187aa0e235da0a68ebcd"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "PK_a497f23b7faa28c72fc231a306a" PRIMARY KEY ("teamsId", "usersId")`);
        await queryRunner.query(`CREATE INDEX "IDX_1694bbd187aa0e235da0a68ebc" ON "teams_members_ids_users" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e8e113e458102df477eec9c36" ON "teams_members_ids_users" ("teamsId") `);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_1694bbd187aa0e235da0a68ebcd" FOREIGN KEY ("usersId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_9e8e113e458102df477eec9c36c" FOREIGN KEY ("teamsId") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
