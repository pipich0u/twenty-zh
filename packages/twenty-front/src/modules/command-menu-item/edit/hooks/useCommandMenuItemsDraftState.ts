import { useQuery } from '@apollo/client/react';
import { isDefined } from 'twenty-shared/utils';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';

import { commandMenuItemsDraftState } from '@/command-menu-item/edit/states/commandMenuItemsDraftState';
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { FindManyCommandMenuItemsDocument } from '~/generated-metadata/graphql';

export const useCommandMenuItemsDraftState = () => {
  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );

  const { data } = useQuery(FindManyCommandMenuItemsDocument);
  const serverItems = data?.commandMenuItems ?? [];

  const draft = useAtomStateValue(commandMenuItemsDraftState);

  const commandMenuItems =
    isLayoutCustomizationModeEnabled && isDefined(draft) ? draft : serverItems;

  const isDirty =
    isLayoutCustomizationModeEnabled &&
    isDefined(draft) &&
    !isDeeplyEqual(
      draft.map(({ id, isPinned, position }) => ({ id, isPinned, position })),
      serverItems.map(({ id, isPinned, position }) => ({
        id,
        isPinned,
        position,
      })),
    );

  return {
    commandMenuItems,
    isDirty,
  };
};
