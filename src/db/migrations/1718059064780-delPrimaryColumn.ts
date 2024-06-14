import { MigrationInterface, QueryRunner } from "typeorm";

export class DelPrimaryColumn1718059064780 implements MigrationInterface {
    name = 'DelPrimaryColumn1718059064780'

    public async up(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_9e33639ece8989dc1274153085f"`);
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "PK_bf6bf30f8d2db16e759fb6f1879"`);
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "PK_ba3401012ad1a62c11d1a4bdfc6" PRIMARY KEY ("teamId")`);
        // await queryRunner.query(`// ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_9e33639ece8989dc1274153085f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "FK_9e33639ece8989dc1274153085f"`);
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" DROP CONSTRAINT "PK_ba3401012ad1a62c11d1a4bdfc6"`);
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "PK_bf6bf30f8d2db16e759fb6f1879" PRIMARY KEY ("teamId", "userId")`);
        // await queryRunner.query(`ALTER TABLE "teams_members_ids_users" ADD CONSTRAINT "FK_9e33639ece8989dc1274153085f" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
