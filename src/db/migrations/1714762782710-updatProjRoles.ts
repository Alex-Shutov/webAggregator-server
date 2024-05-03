import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatProjRoles1714762782710 implements MigrationInterface {
    name = 'UpdatProjRoles1714762782710'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_roles" DROP CONSTRAINT "FK_c289c4af5520c6aa2a41ddfe2e9"`);
        await queryRunner.query(`ALTER TABLE "project_roles" RENAME COLUMN "projectId" TO "teamId"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "eventId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_roles" ADD CONSTRAINT "FK_bdc56eef8825117b39f898ddb97" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_203e3d85f8d67b6ee5d86add690" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_290b816d140e4004011ea802d6f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_29541c35b895c162d8c30975bc6" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_29541c35b895c162d8c30975bc6"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_290b816d140e4004011ea802d6f"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_203e3d85f8d67b6ee5d86add690"`);
        await queryRunner.query(`ALTER TABLE "project_roles" DROP CONSTRAINT "FK_bdc56eef8825117b39f898ddb97"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "projectId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "eventId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_roles" RENAME COLUMN "teamId" TO "projectId"`);
        await queryRunner.query(`ALTER TABLE "project_roles" ADD CONSTRAINT "FK_c289c4af5520c6aa2a41ddfe2e9" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
