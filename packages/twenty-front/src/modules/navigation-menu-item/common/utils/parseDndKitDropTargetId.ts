import { DND_KIT_DROP_TARGET_ID_SEPARATOR } from '@/navigation-menu-item/common/constants/DndKitDropTargetIdSeparator';

export const parseDndKitDropTargetId = (
  dropTargetId: string,
): { droppableId: string; index: number } | null => {
  const separator = DND_KIT_DROP_TARGET_ID_SEPARATOR;
  const separatorIndex = dropTargetId.lastIndexOf(separator);
  if (separatorIndex === -1) {
    return null;
  }
  const droppableId = dropTargetId.slice(0, separatorIndex);
  const indexPart = dropTargetId.slice(separatorIndex + separator.length);
  const parsedIndex = Number(indexPart);
  if (!Number.isInteger(parsedIndex) || parsedIndex < 0) {
    return null;
  }
  return { droppableId, index: parsedIndex };
};
