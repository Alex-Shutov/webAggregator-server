import { MigrationInterface, QueryRunner } from "typeorm";

export class DeleteUserTeams1713604426799 implements MigrationInterface {
    name = 'DeleteUserTeams1713604426799'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "FK_35aa4c8c7bf8e271d41ef140429"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "FK_8a4b04a59f93630b897644f5cbc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_35aa4c8c7bf8e271d41ef14042"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8a4b04a59f93630b897644f5cb"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "PK_7144530459f25a63cab5a00f5d6"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "PK_8a4b04a59f93630b897644f5cbc" PRIMARY KEY ("events")`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP COLUMN "users"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "PK_8a4b04a59f93630b897644f5cbc"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP COLUMN "events"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD "userId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "PK_5249a4163d5c6537fbecb34b68a" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD "eventId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "PK_5249a4163d5c6537fbecb34b68a"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "PK_bd2c9ac072d394072370290e38f" PRIMARY KEY ("userId", "eventId")`);
        await queryRunner.query(`CREATE INDEX "IDX_5249a4163d5c6537fbecb34b68" ON "rated_events_users_ids" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f46bf7ebcedc68b0eca2f356b5" ON "rated_events_users_ids" ("eventId") `);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "FK_5249a4163d5c6537fbecb34b68a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "FK_f46bf7ebcedc68b0eca2f356b53" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "FK_f46bf7ebcedc68b0eca2f356b53"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "FK_5249a4163d5c6537fbecb34b68a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f46bf7ebcedc68b0eca2f356b5"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5249a4163d5c6537fbecb34b68"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "PK_bd2c9ac072d394072370290e38f"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "PK_5249a4163d5c6537fbecb34b68a" PRIMARY KEY ("userId")`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "PK_5249a4163d5c6537fbecb34b68a"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD "events" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "PK_8a4b04a59f93630b897644f5cbc" PRIMARY KEY ("events")`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD "users" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" DROP CONSTRAINT "PK_8a4b04a59f93630b897644f5cbc"`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "PK_7144530459f25a63cab5a00f5d6" PRIMARY KEY ("users", "events")`);
        await queryRunner.query(`CREATE INDEX "IDX_8a4b04a59f93630b897644f5cb" ON "rated_events_users_ids" ("events") `);
        await queryRunner.query(`CREATE INDEX "IDX_35aa4c8c7bf8e271d41ef14042" ON "rated_events_users_ids" ("users") `);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "FK_8a4b04a59f93630b897644f5cbc" FOREIGN KEY ("events") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "rated_events_users_ids" ADD CONSTRAINT "FK_35aa4c8c7bf8e271d41ef140429" FOREIGN KEY ("users") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`CREATE INDEX "IDX_5d44297b07f4b6ea1418d2fedb" ON "users_teams_teams" ("usersId") `);
        await queryRunner.query(`CREATE INDEX "IDX_58b76a3454c868f649f25c0365" ON "users_teams_teams" ("teamsId") `);

    }

}
