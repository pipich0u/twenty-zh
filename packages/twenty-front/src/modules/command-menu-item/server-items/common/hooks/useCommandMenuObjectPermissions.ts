import { useObjectPermissionsForObject } from '@/object-record/hooks/useObjectPermissionsForObject';
import { type CommandMenuContextApi } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

const EMPTY_COMMAND_MENU_OBJECT_PERMISSIONS: CommandMenuContextApi['objectPermissions'] =
  {
    canReadObjectRecords: false,
    canUpdateObjectRecords: false,
    canSoftDeleteObjectRecords: false,
    canDestroyObjectRecords: false,
    restrictedFields: {},
    objectMetadataId: '',
    rowLevelPermissionPredicates: [],
    rowLevelPermissionPredicateGroups: [],
  };

export const useCommandMenuObjectPermissions = ({
  objectMetadataItemId,
}: {
  objectMetadataItemId: string | undefined;
}): CommandMenuContextApi['objectPermissions'] => {
  const objectPermissionsFromHook = useObjectPermissionsForObject(
    objectMetadataItemId ?? '',
  );

  if (!isDefined(objectMetadataItemId)) {
    return EMPTY_COMMAND_MENU_OBJECT_PERMISSIONS;
  }

  return objectPermissionsFromHook;
};
