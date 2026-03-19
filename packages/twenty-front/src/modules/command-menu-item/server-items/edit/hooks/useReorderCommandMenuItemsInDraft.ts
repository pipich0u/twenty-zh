import { useStore } from 'jotai';
import { useCallback } from 'react';
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

      const fullSectionItems = draft
        .filter((item) => item.isPinned === isPinned)
        .sort((a, b) => a.position - b.position);

      const contextualSectionItems = isDefined(contextualItemIds)
        ? fullSectionItems.filter((item) => contextualItemIds.has(item.id))
        : fullSectionItems;

      const fullSectionItemsWithoutSource = fullSectionItems.filter(
        (item) => item.id !== sourceId,
      );
      const contextualSectionItemsWithoutSource = contextualSectionItems.filter(
        (item) => item.id !== sourceId,
      );

      const clampedDestinationIndex = Math.max(
        0,
        Math.min(destinationIndex, contextualSectionItemsWithoutSource.length),
      );

      const nextContextualItem =
        contextualSectionItemsWithoutSource[clampedDestinationIndex];
      const previousContextualItem =
        contextualSectionItemsWithoutSource[clampedDestinationIndex - 1];

      if (
        !isDefined(nextContextualItem) &&
        !isDefined(previousContextualItem)
      ) {
        return;
      }

      // I dont like it but it works
      // TODO : find a better way to do this
      // context aware position calculation - we need to consider the context of the item we are moving
      let previousPosition: number | undefined;
      let nextPosition: number | undefined;

      if (isDefined(nextContextualItem)) {
        const nextItemIndexInFullSection =
          fullSectionItemsWithoutSource.findIndex(
            (item) => item.id === nextContextualItem.id,
          );

        if (nextItemIndexInFullSection === -1) {
          return;
        }

        previousPosition =
          fullSectionItemsWithoutSource[nextItemIndexInFullSection - 1]
            ?.position;
        nextPosition =
          fullSectionItemsWithoutSource[nextItemIndexInFullSection]?.position;
      } else if (isDefined(previousContextualItem)) {
        const previousItemIndexInFullSection =
          fullSectionItemsWithoutSource.findIndex(
            (item) => item.id === previousContextualItem.id,
          );

        if (previousItemIndexInFullSection === -1) {
          return;
        }

        previousPosition =
          fullSectionItemsWithoutSource[previousItemIndexInFullSection]
            ?.position;
        nextPosition =
          fullSectionItemsWithoutSource[previousItemIndexInFullSection + 1]
            ?.position;
      }

      let newPosition: number;

      if (!isDefined(previousPosition) && isDefined(nextPosition)) {
        newPosition = nextPosition - 1;
      } else if (isDefined(previousPosition) && !isDefined(nextPosition)) {
        newPosition = previousPosition + 1;
      } else if (isDefined(previousPosition) && isDefined(nextPosition)) {
        newPosition =
          previousPosition === nextPosition
            ? previousPosition - 1
            : (previousPosition + nextPosition) / 2;
      } else {
        newPosition = 0;
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
