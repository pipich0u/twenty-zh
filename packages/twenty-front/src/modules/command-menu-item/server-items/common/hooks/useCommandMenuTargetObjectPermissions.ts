import { objectPermissionsFamilySelector } from '@/auth/states/objectPermissionsFamilySelector';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useStore } from 'jotai';

type CommandMenuTargetObjectPermissions = {
  targetObjectReadPermissions: Record<string, boolean>;
  targetObjectWritePermissions: Record<string, boolean>;
};

export const useCommandMenuTargetObjectPermissions =
  (): CommandMenuTargetObjectPermissions => {
    const store = useStore();
    const { objectMetadataItems } = useObjectMetadataItems();

    const targetObjectReadPermissions: Record<string, boolean> = {};
    const targetObjectWritePermissions: Record<string, boolean> = {};

    for (const metadataItem of objectMetadataItems) {
      const permissions = store.get(
        objectPermissionsFamilySelector.selectorFamily({
          objectNameSingular: metadataItem.nameSingular,
        }),
      );

      targetObjectReadPermissions[metadataItem.nameSingular] =
        permissions.canRead;
      targetObjectWritePermissions[metadataItem.nameSingular] =
        permissions.canUpdate;
    }

    return {
      targetObjectReadPermissions,
      targetObjectWritePermissions,
    };
  };
