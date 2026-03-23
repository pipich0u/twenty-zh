import { useCallback } from 'react';
import { useStore } from 'jotai';
import { useMutation } from '@apollo/client/react';
import { isDefined } from 'twenty-shared/utils';

import { commandMenuItemsDraftState } from '@/command-menu-item/server-items/edit/states/commandMenuItemsDraftState';
import { UPDATE_COMMAND_MENU_ITEM } from '@/command-menu-item/server-items/common/graphql/mutations/updateCommandMenuItem';
import { commandMenuItemsSelector } from '@/command-menu-item/server-items/common/states/commandMenuItemsSelector';
import { useMetadataStore } from '@/metadata-store/hooks/useMetadataStore';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import {
  type CommandMenuItemFieldsFragment,
  type UpdateCommandMenuItemInput,
} from '~/generated-metadata/graphql';

type UpdateCommandMenuItemMutationResult = {
  updateCommandMenuItem: CommandMenuItemFieldsFragment;
};

export const useSaveCommandMenuItemsDraft = () => {
  const store = useStore();
  const { addToDraft, applyChanges } = useMetadataStore();
  const [updateCommandMenuItem] = useMutation<
    UpdateCommandMenuItemMutationResult,
    { input: UpdateCommandMenuItemInput }
  >(UPDATE_COMMAND_MENU_ITEM);
  const commandMenuItems = useAtomStateValue(commandMenuItemsSelector);

  const saveCommandMenuItemsDraft = useCallback(async () => {
    const draft = store.get(commandMenuItemsDraftState.atom);

    if (!isDefined(draft)) {
      return;
    }

    const serverItemsById = new Map(
      commandMenuItems.map((item) => [item.id, item]),
    );

    const changedItems = draft.filter((draftItem) => {
      const serverItem = serverItemsById.get(draftItem.id);

      if (!isDefined(serverItem)) {
        return false;
      }

      return (
        draftItem.isPinned !== serverItem.isPinned ||
        draftItem.position !== serverItem.position ||
        draftItem.shortLabel !== serverItem.shortLabel
      );
    });

    const mutationResults = await Promise.all(
      changedItems.map((item) => {
        const input: UpdateCommandMenuItemInput = {
          id: item.id,
          isPinned: item.isPinned,
          position: item.position,
          shortLabel: item.shortLabel,
        };

        return updateCommandMenuItem({ variables: { input } });
      }),
    );

    const updatedCommandMenuItems = mutationResults
      .map((result) => result.data?.updateCommandMenuItem)
      .filter(isDefined);

    if (updatedCommandMenuItems.length > 0) {
      addToDraft({
        key: 'commandMenuItems',
        items: updatedCommandMenuItems,
      });
      applyChanges();
    }
  }, [
    store,
    commandMenuItems,
    updateCommandMenuItem,
    addToDraft,
    applyChanges,
  ]);

  return { saveCommandMenuItemsDraft };
};
