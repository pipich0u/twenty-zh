import { type QueryRunner } from 'typeorm';

export const addObjectPermissionUniversalIdentifierAndApplicationIdColumns =
  async (queryRunner: QueryRunner): Promise<void> => {
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ADD "universalIdentifier" uuid DEFAULT gen_random_uuid()`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ADD "applicationId" uuid`,
    );
    await queryRunner.query(`
      UPDATE "core"."objectPermission" op
      SET "applicationId" = (
        SELECT r."applicationId" FROM "core"."role" r
        WHERE r.id = op."roleId"
      )
      WHERE op."applicationId" IS NULL
    `);
  };
