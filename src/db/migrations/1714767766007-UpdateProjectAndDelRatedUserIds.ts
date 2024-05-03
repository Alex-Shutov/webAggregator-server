import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateProjectAndDelRatedUserIds1714767766007 implements MigrationInterface {
    name = 'UpdateProjectAndDelRatedUserIds1714767766007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "screenshots"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP COLUMN "eventId"`);
        await queryRunner.query(`DROP TABLE "rated_events_users_ids"`)
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" ADD "eventId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "projects" ADD "screenshots" text NOT NULL`);
        await queryRunner.query(`CREATE TABLE "rated_events_users_ids" ("users" uuid NOT NULL, "events" uuid NOT NULL, CONSTRAINT "PK_7144530459f25a63cab5a00f5d6" PRIMARY KEY ("users", "events"))`);
    }

}
