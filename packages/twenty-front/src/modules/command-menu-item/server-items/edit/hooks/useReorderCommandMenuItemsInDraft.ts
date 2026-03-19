import { useCallback } from 'react';
import { useStore } from 'jotai';
import { isDefined } from 'twenty-shared/utils';

import { commandMenuItemsDraftState } from '@/command-menu-item/server-items/edit/states/commandMenuItemsDraftState';

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

      const isPinned = targetSection === 'pinned';

      const sectionItems = draft
        .filter(
          (item) =>
            item.isPinned === isPinned &&
            (isDefined(contextualItemIds)
              ? contextualItemIds.has(item.id)
              : true),
        )
        .sort((a, b) => a.position - b.position);

      const filteredSectionItems = sectionItems.filter(
        (item) => item.id !== sourceId,
      );

      let newPosition: number;

      if (filteredSectionItems.length === 0) {
        newPosition = 0;
      } else if (destinationIndex === 0) {
        newPosition = filteredSectionItems[0].position - 1;
      } else if (destinationIndex >= filteredSectionItems.length) {
        newPosition =
          filteredSectionItems[filteredSectionItems.length - 1].position + 1;
      } else {
        const before = filteredSectionItems[destinationIndex - 1].position;
        const after = filteredSectionItems[destinationIndex].position;
        newPosition = (before + after) / 2;
      }

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
