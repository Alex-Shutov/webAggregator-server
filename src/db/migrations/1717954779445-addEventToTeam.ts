import { MigrationInterface, QueryRunner } from "typeorm";

export class AddEventToTeam1717954779445 implements MigrationInterface {
    name = 'AddEventToTeam1717954779445'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_a2661ed02e0c4eb9fbe35a28807"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "teams" ADD "eventId" uuid`);
        await queryRunner.query(`ALTER TABLE "teams" ADD CONSTRAINT "FK_f01dc07b27e3edecf109d539cd1" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "teams" DROP CONSTRAINT "FK_f01dc07b27e3edecf109d539cd1"`);
        await queryRunner.query(`ALTER TABLE "teams" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD "eventId" uuid`);
        await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_a2661ed02e0c4eb9fbe35a28807" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
