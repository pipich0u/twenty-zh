import { type NavigationMenuItem } from '~/generated-metadata/graphql';

import { filterWorkspaceNavigationMenuItems } from '@/navigation-menu-item/common/utils/filterWorkspaceNavigationMenuItems';
import { type PartitionCreatesAndRecreatesResult } from '@/navigation-menu-item/edit/types/PartitionCreatesAndRecreatesResult';

export const partitionCreatesAndRecreates = ({
  draft,
  currentItems,
}: {
  draft: NavigationMenuItem[];
  currentItems: NavigationMenuItem[];
}): PartitionCreatesAndRecreatesResult => {
  const workspaceItems = filterWorkspaceNavigationMenuItems(currentItems);
  const currentIds = new Set(workspaceItems.map((item) => item.id));
  const workspaceItemsById = new Map(
    workspaceItems.map((item) => [item.id, item]),
  );

  const idsToCreate = draft.filter((item) => !currentIds.has(item.id));
  const idsToRecreate = draft.filter((item) => {
    const original = workspaceItemsById.get(item.id);
    if (!original) {
      return false;
    }
    return (
      original.viewId !== item.viewId ||
      original.targetObjectMetadataId !== item.targetObjectMetadataId ||
      original.targetRecordId !== item.targetRecordId
    );
  });

  return {
    workspaceItems,
    workspaceItemsById,
    currentIds,
    idsToCreate,
    idsToRecreate,
  };
};
