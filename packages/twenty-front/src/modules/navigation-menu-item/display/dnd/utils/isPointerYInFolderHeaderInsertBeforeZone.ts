const getFolderHeaderInsertBeforeThresholdY = (
  rect: DOMRectReadOnly,
  bandPx: number,
): number => {
  const depthPx = Math.min(rect.height * 0.5, 28);
  return rect.top + Math.max(bandPx, depthPx);
};

export const isPointerYInFolderHeaderInsertBeforeZone = (
  pointerY: number,
  rect: DOMRectReadOnly,
  bandPx: number,
): boolean => pointerY < getFolderHeaderInsertBeforeThresholdY(rect, bandPx);
