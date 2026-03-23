import { useNavigationMenuItemsData } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemsData';
import { isNonEmptyArray } from '@sniptt/guards';
import { isDefined } from 'twenty-shared/utils';

export const useCommandMenuFavoriteRecordIds = ({
  recordIds,
  objectMetadataItemId,
}: {
  recordIds: string[] | undefined;
  objectMetadataItemId: string | undefined;
}): string[] => {
  const { navigationMenuItems } = useNavigationMenuItemsData();

  if (!isNonEmptyArray(recordIds) || !isDefined(objectMetadataItemId)) {
    return [];
  }

  return recordIds.filter((recordId) =>
    navigationMenuItems?.some(
      (navigationMenuItem) =>
        navigationMenuItem.targetRecordId === recordId &&
        navigationMenuItem.targetObjectMetadataId === objectMetadataItemId,
    ),
  );
};
