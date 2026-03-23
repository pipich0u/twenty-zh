import { isNonEmptyString } from '@sniptt/guards';

import { NavigationMenuItemStyleIcon } from '@/navigation-menu-item/display/components/NavigationMenuItemStyleIcon';
import { getObjectIconColor } from '@/navigation-menu-item/common/utils/getObjectIconColor';
import { type EnrichedObjectMetadataItem } from '@/object-metadata/types/EnrichedObjectMetadataItem';
import { isDefined } from 'twenty-shared/utils';
import { useIcons } from 'twenty-ui/display';

export const RecordIndexPageHeaderIcon = ({
  objectMetadataItem,
}: {
  objectMetadataItem?: EnrichedObjectMetadataItem;
}) => {
  const { getIcon } = useIcons();
  const ObjectIcon = getIcon(objectMetadataItem?.icon);

  if (!isDefined(ObjectIcon)) {
    return null;
  }

  const iconColor = isNonEmptyString(objectMetadataItem?.color)
    ? objectMetadataItem.color
    : getObjectIconColor({
        nameSingular: objectMetadataItem?.nameSingular ?? '',
      });

  return (
    <NavigationMenuItemStyleIcon
      Icon={ObjectIcon}
      color={iconColor ?? undefined}
    />
  );
};
