import { isNonEmptyString } from '@sniptt/guards';

import { getObjectIconColor } from '@/navigation-menu-item/common/utils/getObjectIconColor';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';

export const useObjectNavItemColor = (objectNameSingular: string): string => {
  const { objectMetadataItems } = useObjectMetadataItems();
  const objectMetadataItem = objectMetadataItems.find(
    (item) => item.nameSingular === objectNameSingular,
  );

  const storedColor = objectMetadataItem?.color;
  const fallbackColor = getObjectIconColor({
    nameSingular: objectNameSingular,
    isSystem: objectMetadataItem?.isSystem === true,
  });

  if (isNonEmptyString(storedColor)) {
    return storedColor;
  }

  return fallbackColor;
};
