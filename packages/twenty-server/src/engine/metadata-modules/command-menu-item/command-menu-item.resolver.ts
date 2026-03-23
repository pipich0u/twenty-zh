import { UseGuards, UseInterceptors } from '@nestjs/common';
import {
  Args,
  Float,
  Mutation,
  Parent,
  Query,
  ResolveField,
} from '@nestjs/graphql';

import { FeatureFlagKey } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { resolveOverridableEntityProperty } from 'src/engine/metadata-modules/utils/resolve-overridable-entity-property.util';

import { MetadataResolver } from 'src/engine/api/graphql/graphql-config/decorators/metadata-resolver.decorator';
import { UUIDScalarType } from 'src/engine/api/graphql/workspace-schema-builder/graphql-types/scalars';
import { WorkspaceEntity } from 'src/engine/core-modules/workspace/workspace.entity';
import { AuthWorkspace } from 'src/engine/decorators/auth/auth-workspace.decorator';
import {
  FeatureFlagGuard,
  RequireFeatureFlag,
} from 'src/engine/guards/feature-flag.guard';
import { NoPermissionGuard } from 'src/engine/guards/no-permission.guard';
import { WorkspaceAuthGuard } from 'src/engine/guards/workspace-auth.guard';
import { CommandMenuItemService } from 'src/engine/metadata-modules/command-menu-item/command-menu-item.service';
import { CommandMenuItemDefaultValuesDTO } from 'src/engine/metadata-modules/command-menu-item/dtos/command-menu-item-default-values.dto';
import { CommandMenuItemDTO } from 'src/engine/metadata-modules/command-menu-item/dtos/command-menu-item.dto';
import { CreateCommandMenuItemInput } from 'src/engine/metadata-modules/command-menu-item/dtos/create-command-menu-item.input';
import { UpdateCommandMenuItemInput } from 'src/engine/metadata-modules/command-menu-item/dtos/update-command-menu-item.input';
import { CommandMenuItemGraphqlApiExceptionInterceptor } from 'src/engine/metadata-modules/command-menu-item/interceptors/command-menu-item-graphql-api-exception.interceptor';
import { FrontComponentDTO } from 'src/engine/metadata-modules/front-component/dtos/front-component.dto';
import { FrontComponentService } from 'src/engine/metadata-modules/front-component/front-component.service';
import { WorkspaceMigrationGraphqlApiExceptionInterceptor } from 'src/engine/workspace-manager/workspace-migration/interceptors/workspace-migration-graphql-api-exception.interceptor';

@UseGuards(WorkspaceAuthGuard, FeatureFlagGuard)
@UseInterceptors(
  WorkspaceMigrationGraphqlApiExceptionInterceptor,
  CommandMenuItemGraphqlApiExceptionInterceptor,
)
@MetadataResolver(() => CommandMenuItemDTO)
export class CommandMenuItemResolver {
  constructor(
    private readonly commandMenuItemService: CommandMenuItemService,
    private readonly frontComponentService: FrontComponentService,
  ) {}

  @ResolveField(() => String)
  label(@Parent() commandMenuItem: CommandMenuItemDTO): string {
    return resolveOverridableEntityProperty(commandMenuItem, 'label');
  }

  @ResolveField(() => String, { nullable: true })
  shortLabel(
    @Parent() commandMenuItem: CommandMenuItemDTO,
  ): string | null | undefined {
    return resolveOverridableEntityProperty(commandMenuItem, 'shortLabel');
  }

  @ResolveField(() => Float)
  position(@Parent() commandMenuItem: CommandMenuItemDTO): number {
    return resolveOverridableEntityProperty(commandMenuItem, 'position');
  }

  @ResolveField(() => Boolean)
  isPinned(@Parent() commandMenuItem: CommandMenuItemDTO): boolean {
    return resolveOverridableEntityProperty(commandMenuItem, 'isPinned');
  }

  @ResolveField(() => Boolean)
  isOverridden(@Parent() commandMenuItem: CommandMenuItemDTO): boolean {
    return (
      isDefined(commandMenuItem.overrides) &&
      Object.keys(commandMenuItem.overrides).length > 0
    );
  }

  @ResolveField(() => FrontComponentDTO, { nullable: true })
  async frontComponent(
    @Parent() commandMenuItem: CommandMenuItemDTO,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ) {
    if (!isDefined(commandMenuItem.frontComponentId)) {
      return null;
    }

    return this.frontComponentService.findById(
      commandMenuItem.frontComponentId,
      workspace.id,
    );
  }

  @Query(() => [CommandMenuItemDTO])
  @UseGuards(NoPermissionGuard)
  @RequireFeatureFlag(FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED)
  async commandMenuItems(
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CommandMenuItemDTO[]> {
    return await this.commandMenuItemService.findAll(workspace.id);
  }

  @Query(() => CommandMenuItemDTO, { nullable: true })
  @UseGuards(NoPermissionGuard)
  @RequireFeatureFlag(FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED)
  async commandMenuItem(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CommandMenuItemDTO | null> {
    return await this.commandMenuItemService.findById(id, workspace.id);
  }

  @Query(() => [CommandMenuItemDefaultValuesDTO])
  @UseGuards(NoPermissionGuard)
  @RequireFeatureFlag(FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED)
  async commandMenuItemDefaultValues(
    @Args('ids', { type: () => [UUIDScalarType] }) ids: string[],
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CommandMenuItemDefaultValuesDTO[]> {
    return await this.commandMenuItemService.findDefaultValues(
      ids,
      workspace.id,
    );
  }

  @Mutation(() => CommandMenuItemDTO)
  @UseGuards(NoPermissionGuard)
  @RequireFeatureFlag(FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED)
  async createCommandMenuItem(
    @Args('input') input: CreateCommandMenuItemInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CommandMenuItemDTO> {
    return await this.commandMenuItemService.create(input, workspace.id);
  }

  @Mutation(() => CommandMenuItemDTO)
  @UseGuards(NoPermissionGuard)
  @RequireFeatureFlag(FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED)
  async updateCommandMenuItem(
    @Args('input') input: UpdateCommandMenuItemInput,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CommandMenuItemDTO> {
    return await this.commandMenuItemService.update(input, workspace.id);
  }

  @Mutation(() => CommandMenuItemDTO)
  @UseGuards(NoPermissionGuard)
  @RequireFeatureFlag(FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED)
  async deleteCommandMenuItem(
    @Args('id', { type: () => UUIDScalarType }) id: string,
    @AuthWorkspace() workspace: WorkspaceEntity,
  ): Promise<CommandMenuItemDTO> {
    return await this.commandMenuItemService.delete(id, workspace.id);
  }
}
