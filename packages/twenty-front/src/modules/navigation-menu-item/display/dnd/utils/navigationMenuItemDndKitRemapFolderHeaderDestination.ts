import { isDefined } from 'twenty-shared/utils';

import type { DropDestination } from '@/navigation-menu-item/common/types/navigationMenuItemDndKitDropDestination';
import type { NavigationMenuItemSection } from '@/navigation-menu-item/common/types/NavigationMenuItemSection';
import { extractFolderIdFromDroppableId } from '@/navigation-menu-item/common/utils/extractFolderIdFromDroppableId';
import { parseDndKitDropTargetId } from '@/navigation-menu-item/common/utils/parseDndKitDropTargetId';
import { isPointerYInFolderHeaderInsertBeforeZoneForDndKitTarget } from '@/navigation-menu-item/display/dnd/utils/isPointerYInFolderHeaderInsertBeforeZoneForDndKitTarget';

type RemapFolderHeaderDestinationIfInsertBeforeArgs = {
  destination: DropDestination;
  dndKitTarget: unknown;
  pointerY: number;
  insertBeforeBandPx: number;
  sectionType: NavigationMenuItemSection;
  folderHeaderPrefix: string;
  defaultOrphanDroppableId: string;
  isWorkspaceSection: boolean;
  preClearActiveDropTargetId: string | null | undefined;
  sortedTopLevelOrphans: Array<{ id: string }>;
  orphanItemsForDropTargetHighlight: Array<{ id: string }>;
};

export const remapFolderHeaderDestinationIfInsertBefore = ({
  destination,
  dndKitTarget,
  pointerY,
  insertBeforeBandPx,
  sectionType,
  folderHeaderPrefix,
  defaultOrphanDroppableId,
  isWorkspaceSection,
  preClearActiveDropTargetId,
  sortedTopLevelOrphans,
  orphanItemsForDropTargetHighlight,
}: RemapFolderHeaderDestinationIfInsertBeforeArgs): {
  destination: DropDestination;
  workspaceInsertBeforeItemId?: string;
} => {
  if (!destination.droppableId.startsWith(folderHeaderPrefix)) {
    return { destination };
  }

  const folderId = extractFolderIdFromDroppableId(
    destination.droppableId,
    sectionType,
  );

  const pointerInInsertBeforeFolderZone =
    isPointerYInFolderHeaderInsertBeforeZoneForDndKitTarget(
      pointerY,
      dndKitTarget,
      insertBeforeBandPx,
    );

  let sawOrphanInsertLineAboveThisFolder = false;
  if (
    isWorkspaceSection &&
    isDefined(folderId) &&
    isDefined(preClearActiveDropTargetId)
  ) {
    const parsed = parseDndKitDropTargetId(preClearActiveDropTargetId);
    if (
      parsed !== null &&
      parsed.droppableId === defaultOrphanDroppableId &&
      orphanItemsForDropTargetHighlight[parsed.index]?.id === folderId
    ) {
      sawOrphanInsertLineAboveThisFolder = true;
    }
  }

  const shouldInsertBeforeFolder =
    pointerInInsertBeforeFolderZone || sawOrphanInsertLineAboveThisFolder;

  if (!shouldInsertBeforeFolder) {
    return { destination };
  }

  const folderIndex = folderId
    ? sortedTopLevelOrphans.findIndex((item) => item.id === folderId)
    : -1;

  return {
    destination: {
      droppableId: defaultOrphanDroppableId,
      index: folderIndex >= 0 ? folderIndex : destination.index,
    },
    ...(isDefined(folderId) ? { workspaceInsertBeforeItemId: folderId } : {}),
  };
};
