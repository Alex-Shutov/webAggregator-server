import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNull1718102884566 implements MigrationInterface {
    name = 'AddNull1718102884566'

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
