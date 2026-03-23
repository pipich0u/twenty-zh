# Insert-Before Folder — DnD Rework

## Problem

When dragging items in the workspace sidebar, there was no way to drop an item **above** a folder — it would always drop **into** the folder.

## Original PR Approach (replaced)

The PR solved this by intercepting `onDragMove` (fires on every pixel of mouse movement), manually reading DOM bounding rects, and remapping destinations with ~500 lines of pointer-math logic across 6 new utility files. This worked but was:

- **Expensive at runtime** — `getBoundingClientRect()` + `findIndex` scans on every mouse move
- **Complex** — two near-identical remap functions for hover vs drop, `preClearActiveDropTargetId` state hack
- **Leaking concerns** — DnD hook imported object permissions, views, and metadata

## New Approach: Let dnd-kit do the work

Instead of fighting dnd-kit's collision system, we give it the right droppable targets and let it handle everything natively.

### 1. Thin invisible droppable overlay on folder headers

A new `NavigationMenuItemInsertBeforeDroppableZone` component — a 10px absolutely-positioned overlay at the top of each folder header. It only renders when `isDragging` is true. Its droppable data points to the orphan list at the folder's index, with `insertBeforeItemId` set to the folder's ID.

### 2. `pointerIntersection` collision detector everywhere

The default dnd-kit collision detector uses the **dragged element's full bounding rect**, which meant the tall dragged item always overlapped the thin 10px zone. We switched all droppable slots to use `pointerIntersection` from `@dnd-kit/collision`, which only checks the **actual pointer position**. This gives precise control — the pointer must physically enter a zone to activate it.

### 3. Priority-based zone selection

With both the folder header (priority 3) and the insert-before zone (priority 5) using `pointerIntersection`:

- **Pointer in top 10px** → both detect a collision → insert-before wins (5 > 3)
- **Pointer below 10px** → only folder header detects → drop into folder

No manual pointer-Y math needed — dnd-kit resolves this from the droppable geometry and priorities.

### 4. `insertBeforeItemId` flows through droppable data

Extended `DroppableData` and `SortableTargetDestination` types with an optional `insertBeforeItemId`. When the insert-before zone is the drop target, `resolveDropTarget` reads it from the droppable data and passes it to the handlers. The handlers use it to compute the correct insertion position.

## What was removed

- **`onDragMove` handler** — no per-pixel processing
- **6 utility files** (~300 lines):
  - `isPointerYInFolderHeaderInsertBeforeZone.ts`
  - `isPointerYInFolderHeaderInsertBeforeZoneForDndKitTarget.ts`
  - `navigationMenuItemDndKitGetFolderHeaderInsertBeforeHoverRemap.ts`
  - `navigationMenuItemDndKitRemapFolderHeaderDestination.ts`
  - `parseDndKitDropTargetId.ts`
  - `navigationMenuItemDndKitFolderHeaderInsertBeforeBandPx.ts`
- **Domain imports in the DnD hook** — no more views, object metadata, permissions
- **`orphanItemsForDropTargetHighlight` / `sortedTopLevelOrphans` computations**
- **`preClearActiveDropTargetId` state tracking hack**

## What was kept from the original PR

- `getDestinationFromSortableTarget` fix — keeps destination at orphan level when sorting over a folder in the orphan group
- `getWorkspaceSidebarOrphanItemsInDisplayOrder` extraction — good refactoring, still used by `useNavigationMenuItemSectionItems`
- `insertBeforeItemId` handler logic in `useHandleAddToNavigationDrop` and `useHandleNavigationMenuItemDragAndDrop`

## Net result

- **~50 lines added** (one component) vs **~500 lines added** in the original PR
- **6 files deleted**, **1 file created**
- DnD hook: ~560 lines → ~310 lines
- No `onDragMove`, no DOM rect reads, no manual pointer math
- All collision logic delegated to dnd-kit's native `pointerIntersection` detector
