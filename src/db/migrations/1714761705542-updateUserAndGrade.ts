import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateUserAndGrade1714761705542 implements MigrationInterface {
    name = 'UpdateUserAndGrade1714761705542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_ed857327d8c35e1c39cf5f9c758"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "eventIdId"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "userIdId"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "eventId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "projectId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_203e3d85f8d67b6ee5d86add690" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_290b816d140e4004011ea802d6f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_29541c35b895c162d8c30975bc6" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_29541c35b895c162d8c30975bc6"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_290b816d140e4004011ea802d6f"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP CONSTRAINT "FK_203e3d85f8d67b6ee5d86add690"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "projectId"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "projectId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "grades" DROP COLUMN "eventId"`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "userIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" ADD "eventIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "grades" ADD CONSTRAINT "FK_ed857327d8c35e1c39cf5f9c758" FOREIGN KEY ("eventIdId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
