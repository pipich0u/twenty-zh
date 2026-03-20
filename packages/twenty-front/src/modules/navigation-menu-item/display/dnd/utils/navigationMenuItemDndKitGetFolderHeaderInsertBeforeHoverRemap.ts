import type { DropDestination } from '@/navigation-menu-item/common/types/navigationMenuItemDndKitDropDestination';
import type { NavigationMenuItemSection } from '@/navigation-menu-item/common/types/NavigationMenuItemSection';
import { extractFolderIdFromDroppableId } from '@/navigation-menu-item/common/utils/extractFolderIdFromDroppableId';
import { NAVIGATION_MENU_ITEM_DND_KIT_FOLDER_HEADER_INSERT_BEFORE_BAND_PX } from '@/navigation-menu-item/display/dnd/constants/navigationMenuItemDndKitFolderHeaderInsertBeforeBandPx';
import { isPointerYInFolderHeaderInsertBeforeZoneForDndKitTarget } from '@/navigation-menu-item/display/dnd/utils/isPointerYInFolderHeaderInsertBeforeZoneForDndKitTarget';

type GetFolderHeaderInsertBeforeHoverRemapArgs = {
  pointerY: number;
  dndKitTarget: unknown;
  resolvedDestination: DropDestination;
  sectionType: NavigationMenuItemSection;
  folderHeaderPrefix: string;
  defaultOrphanDroppableId: string;
  sortedTopLevelOrphans: Array<{ id: string }>;
  orphanItemsForDropTargetHighlight: Array<{ id: string }>;
};

export const getFolderHeaderInsertBeforeHoverRemap = ({
  pointerY,
  dndKitTarget,
  resolvedDestination,
  sectionType,
  folderHeaderPrefix,
  defaultOrphanDroppableId,
  sortedTopLevelOrphans,
  orphanItemsForDropTargetHighlight,
}: GetFolderHeaderInsertBeforeHoverRemapArgs): {
  remappedDestination: DropDestination;
  highlightIndex: number;
} | null => {
  const isPointerInInsertBeforeFolderZone =
    isPointerYInFolderHeaderInsertBeforeZoneForDndKitTarget(
      pointerY,
      dndKitTarget,
      NAVIGATION_MENU_ITEM_DND_KIT_FOLDER_HEADER_INSERT_BEFORE_BAND_PX,
    );

  if (
    !isPointerInInsertBeforeFolderZone ||
    !resolvedDestination.droppableId.startsWith(folderHeaderPrefix)
  ) {
    return null;
  }

  const folderId = extractFolderIdFromDroppableId(
    resolvedDestination.droppableId,
    sectionType,
  );
  const folderIndexSorted = folderId
    ? sortedTopLevelOrphans.findIndex((item) => item.id === folderId)
    : -1;
  const folderIndexVisual = folderId
    ? orphanItemsForDropTargetHighlight.findIndex(
        (item) => item.id === folderId,
      )
    : -1;

  const remappedDestination: DropDestination = {
    droppableId: defaultOrphanDroppableId,
    index:
      folderIndexSorted >= 0 ? folderIndexSorted : resolvedDestination.index,
  };

  const highlightIndex =
    folderIndexVisual >= 0 ? folderIndexVisual : remappedDestination.index;

  return { remappedDestination, highlightIndex };
};
