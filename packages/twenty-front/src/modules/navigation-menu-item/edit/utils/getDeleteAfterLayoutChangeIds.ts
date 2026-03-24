import { isDefined } from 'twenty-shared/utils';

import { type NavigationMenuItem } from '~/generated-metadata/graphql';

import { filterWorkspaceNavigationMenuItems } from '@/navigation-menu-item/common/utils/filterWorkspaceNavigationMenuItems';
import { isNavigationMenuItemFolder } from '@/navigation-menu-item/common/utils/isNavigationMenuItemFolder';

export const getDeleteAfterLayoutChangeIds = ({
  draft,
  currentItems,
}: {
  draft: NavigationMenuItem[];
  currentItems: NavigationMenuItem[];
}): string[] => {
  const workspaceItems = filterWorkspaceNavigationMenuItems(currentItems);
  const topLevelWorkspace = workspaceItems.filter(
    (item) => !isDefined(item.folderId),
  );
  const draftIds = new Set(draft.map((item) => item.id));

  const topLevelToDelete = topLevelWorkspace.filter(
    (item) => !draftIds.has(item.id),
  );
  const folderIdsToDelete = new Set(
    topLevelToDelete.filter(isNavigationMenuItemFolder).map((item) => item.id),
  );
  const folderChildrenToDelete = currentItems.filter(
    (item) => isDefined(item.folderId) && folderIdsToDelete.has(item.folderId),
  );

  return [
    ...folderChildrenToDelete.map((item) => item.id),
    ...topLevelToDelete.map((item) => item.id),
  ];
};
