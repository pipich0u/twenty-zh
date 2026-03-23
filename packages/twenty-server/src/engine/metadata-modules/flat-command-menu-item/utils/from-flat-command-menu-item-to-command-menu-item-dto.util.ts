import { isDefined } from 'twenty-shared/utils';

import { type CommandMenuItemDTO } from 'src/engine/metadata-modules/command-menu-item/dtos/command-menu-item.dto';
import { type FlatCommandMenuItem } from 'src/engine/metadata-modules/flat-command-menu-item/types/flat-command-menu-item.type';

export const fromFlatCommandMenuItemToCommandMenuItemDto = (
  flatCommandMenuItem: FlatCommandMenuItem,
): CommandMenuItemDTO => ({
  id: flatCommandMenuItem.id,
  workflowVersionId: flatCommandMenuItem.workflowVersionId ?? undefined,
  frontComponentId: flatCommandMenuItem.frontComponentId ?? undefined,
  engineComponentKey: flatCommandMenuItem.engineComponentKey ?? undefined,
  label: flatCommandMenuItem.label,
  icon: flatCommandMenuItem.icon ?? undefined,
  shortLabel: flatCommandMenuItem.shortLabel ?? undefined,
  position: flatCommandMenuItem.position,
  isPinned: flatCommandMenuItem.isPinned,
  hotKeys: flatCommandMenuItem.hotKeys ?? undefined,
  availabilityType: flatCommandMenuItem.availabilityType,
  conditionalAvailabilityExpression:
    flatCommandMenuItem.conditionalAvailabilityExpression ?? undefined,
  availabilityObjectMetadataId:
    flatCommandMenuItem.availabilityObjectMetadataId ?? undefined,
  isOverridden:
    isDefined(flatCommandMenuItem.overrides) &&
    Object.keys(flatCommandMenuItem.overrides).length > 0,
  overrides: flatCommandMenuItem.overrides ?? null,
  workspaceId: flatCommandMenuItem.workspaceId,
  applicationId: flatCommandMenuItem.applicationId ?? undefined,
  createdAt: new Date(flatCommandMenuItem.createdAt),
  updatedAt: new Date(flatCommandMenuItem.updatedAt),
});
