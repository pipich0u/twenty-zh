import { useCommandMenuItemsDraftState } from '@/command-menu-item/server-items/common/hooks/useCommandMenuItemsDraftState';
import { useConvertBackendItemToCommandMenuItemConfig } from '@/command-menu-item/server-items/common/hooks/useConvertBackendItemToCommandMenuItemConfig';
import { type CommandMenuContextApi } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

export const useCommandMenuItemsFromBackend = (
  commandMenuContextApi: CommandMenuContextApi,
) => {
  const { convertBackendItemToCommandMenuItemConfig } =
    useConvertBackendItemToCommandMenuItemConfig();

  const currentObjectMetadataItemId =
    commandMenuContextApi.objectMetadataItem.id;

  const { commandMenuItems: allItems } = useCommandMenuItemsDraftState();

  const objectMatches = (item: CommandMenuItemFieldsFragment) =>
    !isDefined(item.availabilityObjectMetadataId) ||
    item.availabilityObjectMetadataId === currentObjectMetadataItemId;

  return allItems
    .filter(objectMatches)
    .map((item) =>
      convertBackendItemToCommandMenuItemConfig(item, commandMenuContextApi),
    )
    .filter(isDefined)
    .filter((item) => item.shouldBeRegistered())
    .sort((a, b) => a.position - b.position);
};
