import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

import { Command } from 'nest-commander';
import { DataSource, IsNull, type Repository } from 'typeorm';

import { ActiveOrSuspendedWorkspacesMigrationCommandRunner } from 'src/database/commands/command-runners/active-or-suspended-workspaces-migration.command-runner';
import { RunOnWorkspaceArgs } from 'src/database/commands/command-runners/workspaces-migration.command-runner';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { DataSourceService } from 'src/engine/metadata-modules/data-source/data-source.service';
import { PermissionFlagEntity } from 'src/engine/metadata-modules/permission-flag/permission-flag.entity';
import { GlobalWorkspaceOrmManager } from 'src/engine/twenty-orm/global-workspace-datasource/global-workspace-orm.manager';

@Command({
  name: 'upgrade:1-20:backfill-permission-flag-application-id',
  description:
    'Backfill applicationId on permissionFlag from role; remove orphans so NOT NULL migration can run',
})
export class BackfillPermissionFlagApplicationIdCommand extends ActiveOrSuspendedWorkspacesMigrationCommandRunner {
  private hasRunOnce = false;

  constructor(
    @InjectRepository(WorkspaceEntity)
    protected readonly workspaceRepository: Repository<WorkspaceEntity>,
    protected readonly twentyORMGlobalManager: GlobalWorkspaceOrmManager,
    protected readonly dataSourceService: DataSourceService,
    @InjectDataSource()
    private readonly coreDataSource: DataSource,
  ) {
    super(workspaceRepository, twentyORMGlobalManager, dataSourceService);
  }

  override async runOnWorkspace({
    options,
  }: RunOnWorkspaceArgs): Promise<void> {
    if (this.hasRunOnce) {
      this.logger.log(
        'Skipping has already been run once BackfillPermissionFlagApplicationIdCommand',
      );

      return;
    }

    if (options.dryRun) {
      return;
    }

    const queryRunner = this.coreDataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const repository =
        queryRunner.manager.getRepository(PermissionFlagEntity);
      const withNullApplicationId = await repository.find({
        where: { applicationId: IsNull() },
        relations: ['role'],
      });

      const toUpdate = withNullApplicationId.filter(
        (permissionFlag) => permissionFlag.role?.applicationId != null,
      );
      const toRemove = withNullApplicationId.filter(
        (permissionFlag) => permissionFlag.role?.applicationId == null,
      );

      for (const permissionFlag of toUpdate) {
        permissionFlag.applicationId = permissionFlag.role.applicationId;
      }

      if (toUpdate.length > 0) {
        await repository.save(toUpdate);
      }
      if (toRemove.length > 0) {
        await repository.remove(toRemove);
      }

      await queryRunner.commitTransaction();
      this.logger.log(
        'Successfully run BackfillPermissionFlagApplicationIdCommand',
      );
      this.hasRunOnce = true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      this.logger.error(
        `Rolling back BackfillPermissionFlagApplicationIdCommand: ${error.message}`,
      );
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
