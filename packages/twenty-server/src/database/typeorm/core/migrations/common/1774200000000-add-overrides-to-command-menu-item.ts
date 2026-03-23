import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddOverridesToCommandMenuItem1774200000000
  implements MigrationInterface
{
  name = 'AddOverridesToCommandMenuItem1774200000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."commandMenuItem" ADD "overrides" jsonb`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."commandMenuItem" DROP COLUMN "overrides"`,
    );
  }
}
