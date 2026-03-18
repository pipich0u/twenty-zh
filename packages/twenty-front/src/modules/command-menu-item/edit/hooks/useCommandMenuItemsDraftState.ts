import { isDefined } from 'twenty-shared/utils';
import { isDeeplyEqual } from '~/utils/isDeeplyEqual';

import { commandMenuItemsDraftState } from '@/command-menu-item/edit/states/commandMenuItemsDraftState';
import { commandMenuItemsSelector } from '@/command-menu-item/states/commandMenuItemsSelector';
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

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
      commandMenuItemsDraft.map(({ id, isPinned, position }) => ({
        id,
        isPinned,
        position,
      })),
      commandMenuItems.map(({ id, isPinned, position }) => ({
        id,
        isPinned,
        position,
      })),
    );

  return {
    commandMenuItems: commandMenuItemsForCurrentMode,
    isDirty,
  };
};
