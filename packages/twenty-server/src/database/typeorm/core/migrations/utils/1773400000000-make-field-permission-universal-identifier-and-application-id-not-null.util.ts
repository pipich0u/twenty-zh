import { type QueryRunner } from 'typeorm';

export const makeFieldPermissionUniversalIdentifierAndApplicationIdNotNullQueries =
  async (queryRunner: QueryRunner): Promise<void> => {
    await queryRunner.query(
      `ALTER TABLE "core"."fieldPermission" ALTER COLUMN "universalIdentifier" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."fieldPermission" ALTER COLUMN "applicationId" SET NOT NULL`,
    );
    await queryRunner.query(
      `DROP INDEX IF EXISTS "core"."IDX_7f3a00184670000000000001"`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_7f3a00184670000000000001" ON "core"."fieldPermission" ("workspaceId", "universalIdentifier")`,
    );
    await queryRunner.query(
      `ALTER TABLE "core"."fieldPermission" ADD CONSTRAINT "FK_7f3a00184670000000000002" FOREIGN KEY ("applicationId") REFERENCES "core"."application"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  };
