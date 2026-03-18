import { type MigrationInterface, type QueryRunner } from 'typeorm';

export class AddUniversalIdentifierAndApplicationIdToPermissionFlag1773232418467
  implements MigrationInterface
{
  name = 'AddUniversalIdentifierAndApplicationIdToPermissionFlag1773232418467';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."permissionFlag" ADD "universalIdentifier" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."permissionFlag" ADD "applicationId" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "core"."permissionFlag" DROP CONSTRAINT IF EXISTS "FK_b26a9d39a88d0e72373c677c6c5"`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_da8ffd3c24b4a819430a861067"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."permissionFlag" DROP COLUMN IF EXISTS "applicationId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."permissionFlag" DROP COLUMN IF EXISTS "universalIdentifier"`,
    );
  }
}
