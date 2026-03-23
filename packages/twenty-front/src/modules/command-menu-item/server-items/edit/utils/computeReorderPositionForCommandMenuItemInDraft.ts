import { getPositionBetween } from '@/navigation-menu-item/common/utils/getPositionBetween';
import { getPositionBoundsAtInsertionPoint } from '@/command-menu-item/server-items/edit/utils/getPositionBoundsAtInsertionPoint';
import { isDefined } from 'twenty-shared/utils';

type PositionedSectionItem = {
  id: string;
  position: number;
  isPinned: boolean;
};

export const computeReorderPositionForCommandMenuItemInDraft = (
  items: PositionedSectionItem[],
  sourceId: string,
  destinationIndex: number,
  targetSection: 'pinned' | 'other',
  contextualItemIds?: ReadonlySet<string>,
): number | undefined => {
  const isPinned = targetSection === 'pinned';

  const fullSectionItems = items
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

  if (!isDefined(nextContextualItem) && !isDefined(previousContextualItem)) {
    return undefined;
  }

  const positionBounds = isDefined(nextContextualItem)
    ? getPositionBoundsAtInsertionPoint(
        nextContextualItem.id,
        'before',
        fullSectionItemsWithoutSource,
      )
    : getPositionBoundsAtInsertionPoint(
        previousContextualItem!.id,
        'after',
        fullSectionItemsWithoutSource,
      );

  if (!isDefined(positionBounds)) {
    return undefined;
  }

  return getPositionBetween(
    positionBounds.previousPosition,
    positionBounds.nextPosition,
  );
};
