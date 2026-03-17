import { type QueryRunner } from 'typeorm';

export const addObjectPermissionUniversalIdentifierAndApplicationIdColumns =
  async (queryRunner: QueryRunner): Promise<void> => {
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ADD "universalIdentifier" uuid`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."objectPermission" ADD "applicationId" uuid`,
    );
  };
