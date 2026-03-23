import { useStore } from 'jotai';
import { useCallback } from 'react';
import { isDefined } from 'twenty-shared/utils';

import { commandMenuItemsDraftState } from '@/command-menu-item/server-items/edit/states/commandMenuItemsDraftState';
import { computeReorderPositionForCommandMenuItemInDraft } from '@/command-menu-item/server-items/edit/utils/computeReorderPositionForCommandMenuItemInDraft';

export const useReorderCommandMenuItemsInDraft = () => {
  const store = useStore();

  const reorderCommandMenuItemInDraft = useCallback(
    (
      sourceId: string,
      destinationIndex: number,
      targetSection: 'pinned' | 'other',
      contextualItemIds?: ReadonlySet<string>,
    ) => {
      const draft = store.get(commandMenuItemsDraftState.atom);

      if (!isDefined(draft)) {
        return;
      }

      const newPosition = computeReorderPositionForCommandMenuItemInDraft(
        draft,
        sourceId,
        destinationIndex,
        targetSection,
        contextualItemIds,
      );

      if (!isDefined(newPosition)) {
        return;
      }

      const isPinned = targetSection === 'pinned';

      const updatedDraft = draft.map((item) =>
        item.id === sourceId
          ? { ...item, isPinned, position: newPosition }
          : item,
      );

      store.set(commandMenuItemsDraftState.atom, updatedDraft);
    },
    [store],
  );

  return { reorderCommandMenuItemInDraft };
};
