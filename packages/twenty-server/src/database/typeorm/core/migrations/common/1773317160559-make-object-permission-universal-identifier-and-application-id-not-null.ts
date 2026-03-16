import { type MigrationInterface, type QueryRunner } from 'typeorm';

import { makeObjectPermissionUniversalIdentifierAndApplicationIdNotNullQueries } from 'src/database/typeorm/core/migrations/utils/1773317160558-make-object-permission-universal-identifier-and-application-id-not-null.util';

export class MakeObjectPermissionUniversalIdentifierAndApplicationIdNotNull1773317160559
  implements MigrationInterface
{
  name =
    'MakeObjectPermissionUniversalIdentifierAndApplicationIdNotNull1773317160559';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await makeObjectPermissionUniversalIdentifierAndApplicationIdNotNullQueries(
      queryRunner,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ALTER COLUMN "universalIdentifier" DROP DEFAULT`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ALTER COLUMN "universalIdentifier" SET DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" DROP CONSTRAINT IF EXISTS "FK_f2ecee1066fd43800dbc85f87e4"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_c5ea53618b32558fe24e495f21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ALTER COLUMN "applicationId" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ALTER COLUMN "universalIdentifier" DROP NOT NULL`,
    );
  }
}
