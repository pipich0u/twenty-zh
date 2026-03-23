import { useCommandMenuFavoriteRecordIds } from '@/command-menu-item/server-items/common/hooks/useCommandMenuFavoriteRecordIds';
import { useCommandMenuFeatureFlags } from '@/command-menu-item/server-items/common/hooks/useCommandMenuFeatureFlags';
import { useCommandMenuObjectPermissions } from '@/command-menu-item/server-items/common/hooks/useCommandMenuObjectPermissions';
import { useCommandMenuPageContext } from '@/command-menu-item/server-items/common/hooks/useCommandMenuPageContext';
import { useCommandMenuTargetObjectPermissions } from '@/command-menu-item/server-items/common/hooks/useCommandMenuTargetObjectPermissions';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { recordStoreRecordsSelector } from '@/object-record/record-store/states/selectors/recordStoreRecordsSelector';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { type CommandMenuContextApi } from 'twenty-shared/types';

export const useCommandMenuContextApi = ({
  isInSidePanel,
  contextStoreInstanceId,
}: {
  isInSidePanel: boolean;
  contextStoreInstanceId?: string;
}): CommandMenuContextApi => {
  const contextStoreCurrentObjectMetadataItemId = useAtomComponentStateValue(
    contextStoreCurrentObjectMetadataItemIdComponentState,
    contextStoreInstanceId,
  );

  const contextStoreTargetedRecordsRule = useAtomComponentStateValue(
    contextStoreTargetedRecordsRuleComponentState,
    contextStoreInstanceId,
  );

  const contextStoreNumberOfSelectedRecords = useAtomComponentStateValue(
    contextStoreNumberOfSelectedRecordsComponentState,
    contextStoreInstanceId,
  );

  const { objectMetadataItems } = useObjectMetadataItems();
  const objectMetadataItem = objectMetadataItems.find(
    (item) => item.id === contextStoreCurrentObjectMetadataItemId,
  );

  const recordIds =
    contextStoreTargetedRecordsRule.mode === 'selection'
      ? contextStoreTargetedRecordsRule.selectedRecordIds
      : undefined;

  const selectedRecords = useAtomFamilySelectorValue(
    recordStoreRecordsSelector,
    {
      recordIds: recordIds ?? [],
    },
  );

  const favoriteRecordIds = useCommandMenuFavoriteRecordIds({
    recordIds,
    objectMetadataItemId: objectMetadataItem?.id,
  });
  const objectPermissions = useCommandMenuObjectPermissions({
    objectMetadataItemId: objectMetadataItem?.id,
  });
  const featureFlags = useCommandMenuFeatureFlags();
  const { pageType, isPageInEditMode, hasAnySoftDeleteFilterOnView } =
    useCommandMenuPageContext({
      contextStoreInstanceId,
    });
  const { targetObjectReadPermissions, targetObjectWritePermissions } =
    useCommandMenuTargetObjectPermissions();

  const isSelectAll = contextStoreTargetedRecordsRule.mode === 'exclusion';

  return {
    pageType,
    isInSidePanel,
    isPageInEditMode,
    favoriteRecordIds,
    isSelectAll,
    hasAnySoftDeleteFilterOnView,
    numberOfSelectedRecords: contextStoreNumberOfSelectedRecords,
    objectPermissions,
    selectedRecords,
    featureFlags,
    targetObjectReadPermissions,
    targetObjectWritePermissions,
    objectMetadataItem: objectMetadataItem ?? {},
  };
};
