import { isDefined } from 'twenty-shared/utils';

import {
  CommandMenuItemException,
  CommandMenuItemExceptionCode,
} from 'src/engine/metadata-modules/command-menu-item/command-menu-item.exception';
import { type UpdateCommandMenuItemInput } from 'src/engine/metadata-modules/command-menu-item/dtos/update-command-menu-item.input';
import { FLAT_COMMAND_MENU_ITEM_EDITABLE_PROPERTIES } from 'src/engine/metadata-modules/flat-command-menu-item/constants/flat-command-menu-item-editable-properties.constant';
import { type FlatCommandMenuItemMaps } from 'src/engine/metadata-modules/flat-command-menu-item/types/flat-command-menu-item-maps.type';
import { type FlatCommandMenuItem } from 'src/engine/metadata-modules/flat-command-menu-item/types/flat-command-menu-item.type';
import { type AllFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/types/all-flat-entity-maps.type';
import { findFlatEntityByIdInFlatEntityMaps } from 'src/engine/metadata-modules/flat-entity/utils/find-flat-entity-by-id-in-flat-entity-maps.util';
import { resolveEntityRelationUniversalIdentifiers } from 'src/engine/metadata-modules/flat-entity/utils/resolve-entity-relation-universal-identifiers.util';
import { isCallerOverridingEntity } from 'src/engine/metadata-modules/utils/is-caller-overriding-entity.util';
import { sanitizeOverridableEntityInput } from 'src/engine/metadata-modules/utils/sanitize-overridable-entity-input.util';
import { mergeUpdateInExistingRecord } from 'src/utils/merge-update-in-existing-record.util';

export const fromUpdateCommandMenuItemInputToFlatCommandMenuItemToUpdateOrThrow =
  ({
    flatCommandMenuItemMaps,
    updateCommandMenuItemInput,
    flatObjectMetadataMaps,
    callerApplicationUniversalIdentifier,
    workspaceCustomApplicationUniversalIdentifier,
  }: {
    flatCommandMenuItemMaps: FlatCommandMenuItemMaps;
    updateCommandMenuItemInput: UpdateCommandMenuItemInput;
    callerApplicationUniversalIdentifier: string;
    workspaceCustomApplicationUniversalIdentifier: string;
  } & Pick<
    AllFlatEntityMaps,
    'flatObjectMetadataMaps'
  >): FlatCommandMenuItem => {
    const existingFlatCommandMenuItem = findFlatEntityByIdInFlatEntityMaps({
      flatEntityId: updateCommandMenuItemInput.id,
      flatEntityMaps: flatCommandMenuItemMaps,
    });

    if (!isDefined(existingFlatCommandMenuItem)) {
      throw new CommandMenuItemException(
        'Command menu item not found',
        CommandMenuItemExceptionCode.COMMAND_MENU_ITEM_NOT_FOUND,
      );
    }

    const { id: _id, ...updates } = updateCommandMenuItemInput;

    const shouldOverride = isCallerOverridingEntity({
      callerApplicationUniversalIdentifier,
      entityApplicationUniversalIdentifier:
        existingFlatCommandMenuItem.applicationUniversalIdentifier,
      workspaceCustomApplicationUniversalIdentifier,
    });

    const { overrides, updatedEditableProperties } =
      sanitizeOverridableEntityInput({
        metadataName: 'commandMenuItem',
        existingFlatEntity: existingFlatCommandMenuItem,
        updatedEditableProperties: updates,
        shouldOverride,
      });

    const flatCommandMenuItemToUpdate = {
      ...mergeUpdateInExistingRecord({
        existing: existingFlatCommandMenuItem,
        properties: [...FLAT_COMMAND_MENU_ITEM_EDITABLE_PROPERTIES],
        update: updatedEditableProperties,
      }),
      overrides,
      updatedAt: new Date().toISOString(),
    };

    if (isDefined(updatedEditableProperties.availabilityObjectMetadataId)) {
      const { availabilityObjectMetadataUniversalIdentifier } =
        resolveEntityRelationUniversalIdentifiers({
          metadataName: 'commandMenuItem',
          foreignKeyValues: {
            availabilityObjectMetadataId:
              flatCommandMenuItemToUpdate.availabilityObjectMetadataId,
          },
          flatEntityMaps: { flatObjectMetadataMaps },
        });

      flatCommandMenuItemToUpdate.availabilityObjectMetadataUniversalIdentifier =
        availabilityObjectMetadataUniversalIdentifier;
    }

    return flatCommandMenuItemToUpdate;
  };
