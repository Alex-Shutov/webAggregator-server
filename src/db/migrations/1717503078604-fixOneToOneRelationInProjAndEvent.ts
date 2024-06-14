import { MigrationInterface, QueryRunner } from "typeorm";

export class FixOneToOneRelationInProjAndEvent1717503078604 implements MigrationInterface {
    name = 'FixOneToOneRelationInProjAndEvent1717503078604'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_5ce96328534931bfee317799c91"`);
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "UQ_5ce96328534931bfee317799c91"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_5ce96328534931bfee317799c91" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_5ce96328534931bfee317799c91"`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "UQ_5ce96328534931bfee317799c91" UNIQUE ("eventId")`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_5ce96328534931bfee317799c91" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
