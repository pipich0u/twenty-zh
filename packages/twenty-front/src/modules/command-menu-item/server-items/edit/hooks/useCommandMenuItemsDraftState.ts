import { isDefined } from 'twenty-shared/utils';

import { commandMenuItemsDraftState } from '@/command-menu-item/server-items/edit/states/commandMenuItemsDraftState';
import { commandMenuItemsSelector } from '@/command-menu-item/server-items/common/states/commandMenuItemsSelector';
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

import { isDeeplyEqual } from '~/utils/isDeeplyEqual';

export const useCommandMenuItemsDraftState = () => {
  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );

  const commandMenuItems = useAtomStateValue(commandMenuItemsSelector);

  const commandMenuItemsDraft = useAtomStateValue(commandMenuItemsDraftState);

  const commandMenuItemsForCurrentMode =
    isLayoutCustomizationModeEnabled && isDefined(commandMenuItemsDraft)
      ? commandMenuItemsDraft
      : commandMenuItems;

  const isDirty =
    isLayoutCustomizationModeEnabled &&
    isDefined(commandMenuItemsDraft) &&
    !isDeeplyEqual(
      commandMenuItemsDraft.map(({ id, isPinned, position, shortLabel }) => ({
        id,
        isPinned,
        position,
        shortLabel,
      })),
      commandMenuItems.map(({ id, isPinned, position, shortLabel }) => ({
        id,
        isPinned,
        position,
        shortLabel,
      })),
    );

  return {
    commandMenuItems: commandMenuItemsForCurrentMode,
    isDirty,
  };
};
