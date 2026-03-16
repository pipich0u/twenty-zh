import { type MigrationInterface, type QueryRunner } from 'typeorm';

import { addObjectPermissionUniversalIdentifierAndApplicationIdColumns } from 'src/database/typeorm/core/migrations/utils/1773317160558-add-universal-identifier-and-application-id-to-object-permission.util';

export class AddUniversalIdentifierAndApplicationIdToObjectPermission1773317160558
  implements MigrationInterface
{
  name =
    'AddUniversalIdentifierAndApplicationIdToObjectPermission1773317160558';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const savepointName =
      'sp_add_object_permission_universal_identifier_and_application_id';

    try {
      await queryRunner.query(`SAVEPOINT ${savepointName}`);

      await addObjectPermissionUniversalIdentifierAndApplicationIdColumns(
        queryRunner,
      );

      await queryRunner.query(`RELEASE SAVEPOINT ${savepointName}`);
    } catch (e) {
      try {
        await queryRunner.query(`ROLLBACK TO SAVEPOINT ${savepointName}`);
        await queryRunner.query(`RELEASE SAVEPOINT ${savepointName}`);
      } catch (rollbackError) {
        // oxlint-disable-next-line no-console
        console.error(
          'Failed to rollback to savepoint in AddUniversalIdentifierAndApplicationIdToObjectPermission1773317160558',
          rollbackError,
        );
        throw rollbackError;
      }

      // oxlint-disable-next-line no-console
      console.error(
        'Swallowing AddUniversalIdentifierAndApplicationIdToObjectPermission1773317160558 error',
        e,
      );
    }
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
