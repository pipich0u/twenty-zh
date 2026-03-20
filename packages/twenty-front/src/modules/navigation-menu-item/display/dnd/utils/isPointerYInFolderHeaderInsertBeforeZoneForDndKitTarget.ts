import { isPointerYInFolderHeaderInsertBeforeZone } from '@/navigation-menu-item/display/dnd/utils/isPointerYInFolderHeaderInsertBeforeZone';

type DndKitDomTarget = {
  element?: Element | null;
  proxy?: Element | null;
};

export const isPointerYInFolderHeaderInsertBeforeZoneForDndKitTarget = (
  pointerY: number,
  target: unknown,
  bandPx: number,
): boolean => {
  if (target === null || typeof target !== 'object') {
    return false;
  }
  const { element, proxy } = target as DndKitDomTarget;
  const domElement = element ?? proxy ?? null;
  const rect = domElement?.getBoundingClientRect?.() ?? null;
  return (
    rect != null &&
    isPointerYInFolderHeaderInsertBeforeZone(pointerY, rect, bandPx)
  );
};
