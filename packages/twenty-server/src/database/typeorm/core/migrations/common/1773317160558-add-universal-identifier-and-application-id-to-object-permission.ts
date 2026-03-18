import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddUniversalIdentifierAndApplicationIdToObjectPermission1773317160558
  implements MigrationInterface
{
  name =
    'AddUniversalIdentifierAndApplicationIdToObjectPermission1773317160558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ADD "universalIdentifier" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ADD "applicationId" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" DROP CONSTRAINT IF EXISTS "FK_f2ecee1066fd43800dbc85f87e4"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_c5ea53618b32558fe24e495f21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" DROP COLUMN IF EXISTS "applicationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" DROP COLUMN IF EXISTS "universalIdentifier"`,
    );
  }
}
