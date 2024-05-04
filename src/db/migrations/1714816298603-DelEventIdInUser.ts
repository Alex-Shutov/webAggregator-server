import { MigrationInterface, QueryRunner } from "typeorm";

export class DelEventIdInUser1714816298603 implements MigrationInterface {
    name = 'DelEventIdInUser1714816298603'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_2e2ae15d5efcd1e07ba97298ce5"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_57a4307c07ce7f849ce28e895ec"`);
        await queryRunner.query(`ALTER TABLE "projects" RENAME COLUMN "eventIdId" TO "eventId"`);
        await queryRunner.query(`ALTER TABLE "projects" RENAME CONSTRAINT "UQ_2e2ae15d5efcd1e07ba97298ce5" TO "UQ_5ce96328534931bfee317799c91"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "eventIdId"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_5ce96328534931bfee317799c91" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_5ce96328534931bfee317799c91"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "eventIdId" uuid`);
        await queryRunner.query(`ALTER TABLE "projects" RENAME CONSTRAINT "UQ_5ce96328534931bfee317799c91" TO "UQ_2e2ae15d5efcd1e07ba97298ce5"`);
        await queryRunner.query(`ALTER TABLE "projects" RENAME COLUMN "eventId" TO "eventIdId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_57a4307c07ce7f849ce28e895ec" FOREIGN KEY ("eventIdId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_2e2ae15d5efcd1e07ba97298ce5" FOREIGN KEY ("eventIdId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
