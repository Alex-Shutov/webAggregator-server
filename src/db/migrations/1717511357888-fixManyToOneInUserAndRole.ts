import { MigrationInterface, QueryRunner } from "typeorm";

export class FixManyToOneInUserAndRole1717511357888 implements MigrationInterface {
    name = 'FixManyToOneInUserAndRole1717511357888'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "project_roles" DROP CONSTRAINT "FK_bdc56eef8825117b39f898ddb97"`);
        await queryRunner.query(`ALTER TABLE "project_roles" DROP CONSTRAINT "FK_94bb3752bfef052e9fe1b12d82a"`);
        await queryRunner.query(`ALTER TABLE "project_roles" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "project_roles" DROP COLUMN "teamId"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "projectRolesId" uuid`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_60c13180ea22def195944acc68c" FOREIGN KEY ("projectRolesId") REFERENCES "project_roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_60c13180ea22def195944acc68c"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "projectRolesId"`);
        await queryRunner.query(`ALTER TABLE "project_roles" ADD "teamId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_roles" ADD "userId" uuid`);
        await queryRunner.query(`ALTER TABLE "project_roles" ADD CONSTRAINT "FK_94bb3752bfef052e9fe1b12d82a" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "project_roles" ADD CONSTRAINT "FK_bdc56eef8825117b39f898ddb97" FOREIGN KEY ("teamId") REFERENCES "teams"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
