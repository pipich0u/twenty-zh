import { type DragDropProvider } from '@dnd-kit/react';
import { isSortable } from '@dnd-kit/react/sortable';
import type { ResponderProvided } from '@hello-pangea/dnd';
import { useStore } from 'jotai';
import { type ComponentProps, useCallback, useMemo, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';

import { ADD_TO_NAV_SOURCE_DROPPABLE_ID } from '@/navigation-menu-item/common/constants/AddToNavSourceDroppableId';
import { NavigationSections } from '@/navigation-menu-item/common/constants/NavigationSections.constants';
import { addToNavPayloadRegistryState } from '@/navigation-menu-item/common/states/addToNavPayloadRegistryState';
import type { DraggableData } from '@/navigation-menu-item/common/types/navigationMenuItemDndKitDraggableData';
import type { DropDestination } from '@/navigation-menu-item/common/types/navigationMenuItemDndKitDropDestination';
import type { NavigationMenuItemSection } from '@/navigation-menu-item/common/types/NavigationMenuItemSection';
import { canNavigationMenuItemBeDroppedIn } from '@/navigation-menu-item/common/utils/canNavigationMenuItemBeDroppedIn';
import { extractFolderIdFromDroppableId } from '@/navigation-menu-item/common/utils/extractFolderIdFromDroppableId';
import { getDndKitDropTargetId } from '@/navigation-menu-item/common/utils/getDndKitDropTargetId';
import { isNavigationMenuItemFolder } from '@/navigation-menu-item/common/utils/isNavigationMenuItemFolder';
import { parseDndKitDropTargetId } from '@/navigation-menu-item/common/utils/parseDndKitDropTargetId';
import { DROP_RESULT_OPTIONS } from '@/navigation-menu-item/display/dnd/constants/navigationMenuItemDndKitDropResultOptions';
import { NAVIGATION_MENU_ITEM_DND_KIT_FOLDER_HEADER_INSERT_BEFORE_BAND_PX } from '@/navigation-menu-item/display/dnd/constants/navigationMenuItemDndKitFolderHeaderInsertBeforeBandPx';
import { useHandleAddToNavigationDrop } from '@/navigation-menu-item/display/dnd/hooks/useHandleAddToNavigationDrop';
import { useHandleNavigationMenuItemDragAndDrop } from '@/navigation-menu-item/display/dnd/hooks/useHandleNavigationMenuItemDragAndDrop';
import { isPointerYInFolderHeaderInsertBeforeZone } from '@/navigation-menu-item/display/dnd/utils/isPointerYInFolderHeaderInsertBeforeZone';
import { resolveDropTarget } from '@/navigation-menu-item/display/dnd/utils/navigationMenuItemDndKitResolveDropTarget';
import { toDropResult } from '@/navigation-menu-item/display/dnd/utils/navigationMenuItemDndKitToDropResult';
import { useNavigationMenuItemsData } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemsData';
import { useSortedNavigationMenuItems } from '@/navigation-menu-item/display/hooks/useSortedNavigationMenuItems';
import { getWorkspaceSidebarOrphanItemsInDisplayOrder } from '@/navigation-menu-item/display/utils/getWorkspaceSidebarOrphanItemsInDisplayOrder';
import { useNavigationMenuItemsDraftState } from '@/navigation-menu-item/edit/hooks/useNavigationMenuItemsDraftState';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { useObjectPermissions } from '@/object-record/hooks/useObjectPermissions';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { viewsSelector } from '@/views/states/selectors/viewsSelector';

import { NAVIGATION_MENU_ITEM_SECTION_DROPPABLE_CONFIG } from '@/navigation-menu-item/common/constants/NavigationMenuItemSectionDroppableConfig';
import type { SortableTargetDestination } from '@/navigation-menu-item/common/types/navigationMenuItemDndKitSortableTargetDestination';

type DragStartPayload = Parameters<
  NonNullable<
    ComponentProps<typeof DragDropProvider<DraggableData>>['onDragStart']
  >
>[0];
type DragOverPayload = Parameters<
  NonNullable<
    ComponentProps<typeof DragDropProvider<DraggableData>>['onDragOver']
  >
>[0];
type NavigationMenuDndOperation = DragOverPayload['operation'];
type DragMovePayload = Parameters<
  NonNullable<
    ComponentProps<typeof DragDropProvider<DraggableData>>['onDragMove']
  >
>[0];
type DragEndPayload = Parameters<
  NonNullable<
    ComponentProps<typeof DragDropProvider<DraggableData>>['onDragEnd']
  >
>[0];

export type NavigationMenuItemDndKitContextValues = {
  dragSource: { sourceDroppableId: string | null };
  drag: { isDragging: boolean };
  dropTarget: {
    activeDropTargetId: string | null;
    setActiveDropTargetId: (id: string | null) => void;
    forbiddenDropTargetId: string | null;
    setForbiddenDropTargetId: (id: string | null) => void;
    addToNavigationFallbackDestination: DropDestination | null;
  };
};

export const useNavigationMenuItemDndKit = (
  section: NavigationSections,
): {
  contextValues: NavigationMenuItemDndKitContextValues;
  handlers: {
    onDragStart: (event: DragStartPayload) => void;
    onDragMove: (event: DragMovePayload) => void;
    onDragOver: (event: DragOverPayload) => void;
    onDragEnd: (event: DragEndPayload) => void;
  };
} => {
  const sectionType: NavigationMenuItemSection =
    section === NavigationSections.FAVORITES ? 'favorite' : 'workspace';
  const isWorkspaceSection = sectionType === 'workspace';

  const store = useStore();

  const [isDragging, setIsDragging] = useState(false);
  const [sourceDroppableId, setSourceDroppableId] = useState<string | null>(
    null,
  );
  const [activeDropTargetId, setActiveDropTargetId] = useState<string | null>(
    null,
  );
  const [forbiddenDropTargetId, setForbiddenDropTargetId] = useState<
    string | null
  >(null);
  const [
    addToNavigationFallbackDestination,
    setAddToNavigationFallbackDestination,
  ] = useState<DropDestination | null>(null);

  const { navigationMenuItems } = useNavigationMenuItemsData();
  const { navigationMenuItemsSorted, workspaceNavigationMenuItemsSorted } =
    useSortedNavigationMenuItems();
  const views = useAtomStateValue(viewsSelector);
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const { objectPermissionsByObjectMetadataId } = useObjectPermissions();
  const { workspaceNavigationMenuItems } = useNavigationMenuItemsDraftState();
  const { handleAddToNavigationDrop } = useHandleAddToNavigationDrop();
  const { handleNavigationMenuItemDragAndDrop } =
    useHandleNavigationMenuItemDragAndDrop(sectionType);

  const items = isWorkspaceSection
    ? workspaceNavigationMenuItems
    : navigationMenuItems;

  const orphanItems = isWorkspaceSection
    ? workspaceNavigationMenuItems
    : navigationMenuItemsSorted;

  const orphanItemCount = orphanItems.filter(
    (item: { folderId?: string | null }) => !isDefined(item.folderId),
  ).length;

  const sortedTopLevelOrphans = useMemo(
    () =>
      orphanItems
        .filter(
          (item: { folderId?: string | null }) => !isDefined(item.folderId),
        )
        .sort((a, b) => a.position - b.position),
    [orphanItems],
  );

  const orphanItemsForDropTargetHighlight = useMemo(() => {
    if (!isWorkspaceSection) {
      return [];
    }
    return getWorkspaceSidebarOrphanItemsInDisplayOrder({
      workspaceNavigationMenuItems,
      workspaceNavigationMenuItemsSorted,
      objectMetadataItems,
      views,
      objectPermissionsByObjectMetadataId,
    });
  }, [
    isWorkspaceSection,
    workspaceNavigationMenuItems,
    workspaceNavigationMenuItemsSorted,
    objectMetadataItems,
    views,
    objectPermissionsByObjectMetadataId,
  ]);

  const { orphanDroppableId: defaultOrphanDroppableId, folderHeaderPrefix } =
    NAVIGATION_MENU_ITEM_SECTION_DROPPABLE_CONFIG[sectionType];

  const getNavItemById = useCallback(
    (id: string | undefined) =>
      id ? items.find((item) => item.id === id) : undefined,
    [items],
  );

  const getAddToNavPayload = useCallback(
    (sourceId: unknown) =>
      store.get(addToNavPayloadRegistryState.atom).get(String(sourceId)) ??
      null,
    [store],
  );

  const isSourceFolderDrag = useCallback(
    (source: { id?: unknown; data?: unknown } | null): boolean => {
      const sourceItem = getNavItemById(
        source?.id != null ? String(source.id) : undefined,
      );
      if (isDefined(sourceItem) && isNavigationMenuItemFolder(sourceItem)) {
        return true;
      }
      const payload = getAddToNavPayload(source?.id);
      return payload?.type === 'FOLDER';
    },
    [getNavItemById, getAddToNavPayload],
  );

  const computeForbiddenTargetId = useCallback(
    (
      source: { id?: unknown; data?: unknown } | null,
      resolved: SortableTargetDestination,
      isAddToNavDrag: boolean,
    ): string | null => {
      const sourceIsFolder = isAddToNavDrag
        ? getAddToNavPayload(source?.id)?.type === 'FOLDER'
        : isSourceFolderDrag(source);

      if (!sourceIsFolder) {
        return null;
      }

      if (resolved.isTargetFolder) {
        return resolved.effectiveDropTargetId;
      }

      const destFolderId = extractFolderIdFromDroppableId(
        resolved.destination.droppableId,
        sectionType,
      );
      if (isDefined(destFolderId)) {
        return resolved.dropTargetId;
      }

      return null;
    },
    [sectionType, getAddToNavPayload, isSourceFolderDrag],
  );

  const applyWorkspaceReorder = useCallback(
    (
      id: string,
      source: DropDestination,
      destination: DropDestination,
      insertBeforeItemId?: string | null,
    ) => {
      const result = toDropResult(
        id,
        {
          sourceDroppableId: source.droppableId,
          sourceIndex: source.index,
        },
        destination,
      );
      const provided: ResponderProvided = { announce: () => {} };
      handleNavigationMenuItemDragAndDrop(
        {
          ...result,
          ...DROP_RESULT_OPTIONS,
          ...(insertBeforeItemId != null && { insertBeforeItemId }),
        },
        provided,
      );
    },
    [handleNavigationMenuItemDragAndDrop],
  );

  const handleDragStart = (event: DragStartPayload) => {
    const { operation } = event;
    setIsDragging(true);
    const source = operation.source;
    const sourceId = source?.data?.sourceDroppableId ?? null;
    setSourceDroppableId(sourceId);

    if (sourceId === ADD_TO_NAV_SOURCE_DROPPABLE_ID) {
      const defaultDestination: DropDestination = {
        droppableId: defaultOrphanDroppableId,
        index: orphanItemCount,
      };
      setAddToNavigationFallbackDestination(defaultDestination);
      setActiveDropTargetId(
        getDndKitDropTargetId(
          defaultDestination.droppableId,
          defaultDestination.index,
        ),
      );
    }
  };

  const applyDragHoverFromOperation = useCallback(
    (operation: NavigationMenuDndOperation) => {
      const source = operation.source;
      const target = operation.target;
      const isAddToNavDrag =
        sourceDroppableId === ADD_TO_NAV_SOURCE_DROPPABLE_ID;
      const sourceIsSortable = source !== null && isSortable(source);
      const resolved = resolveDropTarget(target, getNavItemById, sectionType);

      // Branch 1: sortable-to-sortable
      if (
        resolved !== null &&
        source !== null &&
        target !== null &&
        isSortable(source) &&
        isSortable(target)
      ) {
        const forbiddenId = isAddToNavDrag
          ? computeForbiddenTargetId(source, resolved, true)
          : computeForbiddenTargetId(source, resolved, false);

        setActiveDropTargetId(resolved.dropTargetId);
        setForbiddenDropTargetId(forbiddenId);
        return;
      }

      // Branch 2: sortable-to-droppable-slot
      if (resolved !== null && sourceIsSortable) {
        const pointerY = operation.position.current.y;
        const targetElement =
          (target as unknown as { element?: Element | null }).element ??
          (target as unknown as { proxy?: Element | null }).proxy ??
          null;
        const rect = targetElement?.getBoundingClientRect?.() ?? null;
        const isPointerInInsertBeforeFolderZone =
          rect != null &&
          isPointerYInFolderHeaderInsertBeforeZone(
            pointerY,
            rect,
            NAVIGATION_MENU_ITEM_DND_KIT_FOLDER_HEADER_INSERT_BEFORE_BAND_PX,
          );

        if (isPointerInInsertBeforeFolderZone) {
          const folderId = extractFolderIdFromDroppableId(
            resolved.destination.droppableId,
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
              folderIndexSorted >= 0
                ? folderIndexSorted
                : resolved.destination.index,
          };

          const highlightIndex =
            folderIndexVisual >= 0
              ? folderIndexVisual
              : remappedDestination.index;

          setActiveDropTargetId(
            getDndKitDropTargetId(
              remappedDestination.droppableId,
              highlightIndex,
            ),
          );
          setAddToNavigationFallbackDestination(remappedDestination);
          setForbiddenDropTargetId(null);
          return;
        }

        setActiveDropTargetId(resolved.effectiveDropTargetId);
        setAddToNavigationFallbackDestination(resolved.destination);
        setForbiddenDropTargetId(
          computeForbiddenTargetId(source, resolved, isAddToNavDrag),
        );
        return;
      }

      if (!isAddToNavDrag) {
        return;
      }

      // Branch 3: add-to-nav drag
      if (resolved !== null) {
        setAddToNavigationFallbackDestination(resolved.destination);
        setActiveDropTargetId(resolved.effectiveDropTargetId);
        setForbiddenDropTargetId(
          computeForbiddenTargetId(source, resolved, true),
        );
        return;
      }

      const fallback = addToNavigationFallbackDestination;
      setActiveDropTargetId(
        fallback
          ? getDndKitDropTargetId(fallback.droppableId, fallback.index)
          : null,
      );
      setForbiddenDropTargetId(null);
    },
    [
      sourceDroppableId,
      addToNavigationFallbackDestination,
      getNavItemById,
      sectionType,
      computeForbiddenTargetId,
      defaultOrphanDroppableId,
      sortedTopLevelOrphans,
      orphanItemsForDropTargetHighlight,
    ],
  );

  const handleDragOver = useCallback(
    (event: DragOverPayload) => {
      applyDragHoverFromOperation(event.operation);
    },
    [applyDragHoverFromOperation],
  );

  const handleDragMove = useCallback(
    (event: DragMovePayload) => {
      if (event.operation.source === null) {
        return;
      }
      applyDragHoverFromOperation(event.operation);
    },
    [applyDragHoverFromOperation],
  );

  const handleDragEnd = (event: DragEndPayload) => {
    const preClearActiveDropTargetId = activeDropTargetId;
    const { operation } = event;
    const source = operation.source;
    const target = operation.target;
    const draggableId = String(source?.id);
    const data = source?.data;
    const sourceId = data?.sourceDroppableId ?? null;
    const fallback = addToNavigationFallbackDestination;

    setIsDragging(false);
    setSourceDroppableId(null);
    setActiveDropTargetId(null);
    setForbiddenDropTargetId(null);
    setAddToNavigationFallbackDestination(null);

    const sourceIsSortable = source !== null && isSortable(source);
    const targetIsSortable = target !== null && isSortable(target);
    const resolved = resolveDropTarget(target, getNavItemById, sectionType);

    // Workspace fast path: sortable-to-sortable within workspace
    if (
      isWorkspaceSection &&
      sourceIsSortable &&
      targetIsSortable &&
      isDefined(source) &&
      isDefined(target) &&
      resolved !== null
    ) {
      const sourceDraggable = 'initialGroup' in source ? source : null;
      const initialGroup = String(sourceDraggable?.initialGroup ?? '');
      const initialIndex = sourceDraggable?.initialIndex ?? 0;
      const destGroup = String(target.group ?? '');
      const bothWorkspace =
        canNavigationMenuItemBeDroppedIn({
          navigationMenuItemSection: 'workspace',
          droppableId: initialGroup,
        }) &&
        canNavigationMenuItemBeDroppedIn({
          navigationMenuItemSection: 'workspace',
          droppableId: destGroup,
        });
      if (bothWorkspace) {
        const insertBeforeItemId =
          target?.id != null ? String(target.id) : undefined;
        applyWorkspaceReorder(
          draggableId,
          { droppableId: initialGroup, index: initialIndex },
          resolved.destination,
          insertBeforeItemId,
        );
        return;
      }
    }

    let destination: DropDestination | null = resolved?.destination ?? null;
    let workspaceInsertBeforeItemId: string | undefined;

    if (
      destination == null &&
      isDefined(fallback) &&
      canNavigationMenuItemBeDroppedIn({
        navigationMenuItemSection: sectionType,
        droppableId: fallback.droppableId,
      })
    ) {
      destination = fallback;
    }

    if (
      destination != null &&
      destination.droppableId.startsWith(folderHeaderPrefix)
    ) {
      const targetElement =
        (target as unknown as { element?: Element | null }).element ??
        (target as unknown as { proxy?: Element | null }).proxy ??
        null;
      const rect = targetElement?.getBoundingClientRect?.() ?? null;
      const pointerY = operation.position.current.y;
      const folderId = extractFolderIdFromDroppableId(
        destination.droppableId,
        sectionType,
      );
      const pointerInInsertBeforeFolderZone =
        rect != null &&
        isPointerYInFolderHeaderInsertBeforeZone(
          pointerY,
          rect,
          NAVIGATION_MENU_ITEM_DND_KIT_FOLDER_HEADER_INSERT_BEFORE_BAND_PX,
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

      if (shouldInsertBeforeFolder) {
        const folderIndex = folderId
          ? sortedTopLevelOrphans.findIndex((item) => item.id === folderId)
          : -1;

        destination = {
          droppableId: defaultOrphanDroppableId,
          index: folderIndex >= 0 ? folderIndex : destination.index,
        };
        if (isDefined(folderId)) {
          workspaceInsertBeforeItemId = folderId;
        }
      }
    }

    const result = toDropResult(draggableId, data, destination);
    const provided: ResponderProvided = { announce: () => {} };
    const dropResult = { ...result, ...DROP_RESULT_OPTIONS };

    if (sourceId === ADD_TO_NAV_SOURCE_DROPPABLE_ID) {
      handleAddToNavigationDrop(dropResult, provided);
      return;
    }

    if (isWorkspaceSection) {
      if (
        isDefined(sourceId) &&
        canNavigationMenuItemBeDroppedIn({
          navigationMenuItemSection: 'workspace',
          droppableId: sourceId,
        }) &&
        isDefined(destination) &&
        canNavigationMenuItemBeDroppedIn({
          navigationMenuItemSection: 'workspace',
          droppableId: destination.droppableId,
        })
      ) {
        applyWorkspaceReorder(
          draggableId,
          {
            droppableId: data?.sourceDroppableId ?? '',
            index: data?.sourceIndex ?? 0,
          },
          destination,
          workspaceInsertBeforeItemId,
        );
      }
      return;
    }

    handleNavigationMenuItemDragAndDrop(dropResult, provided);
  };

  const contextValues: NavigationMenuItemDndKitContextValues = {
    dragSource: { sourceDroppableId },
    drag: { isDragging },
    dropTarget: {
      activeDropTargetId,
      setActiveDropTargetId,
      forbiddenDropTargetId,
      setForbiddenDropTargetId,
      addToNavigationFallbackDestination,
    },
  };

  return {
    contextValues,
    handlers: {
      onDragStart: handleDragStart,
      onDragMove: handleDragMove,
      onDragOver: handleDragOver,
      onDragEnd: handleDragEnd,
    },
  };
};
