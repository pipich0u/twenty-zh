import { useCommandMenuFavoriteRecordIds } from '@/command-menu-item/server-items/common/hooks/useCommandMenuFavoriteRecordIds';
import { useCommandMenuFeatureFlags } from '@/command-menu-item/server-items/common/hooks/useCommandMenuFeatureFlags';
import { useCommandMenuObjectPermissions } from '@/command-menu-item/server-items/common/hooks/useCommandMenuObjectPermissions';
import { useCommandMenuPageContext } from '@/command-menu-item/server-items/common/hooks/useCommandMenuPageContext';
import { useCommandMenuTargetObjectPermissions } from '@/command-menu-item/server-items/common/hooks/useCommandMenuTargetObjectPermissions';
import { useCommandMenuContextStoreInstanceId } from '@/command-menu-item/contexts/useCommandMenuContextStoreInstanceId';
import { commandMenuItemEditRecordSelectionPreviewModeState } from '@/command-menu-item/server-items/edit/states/commandMenuItemEditRecordSelectionPreviewModeState';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { recordIndexAllRecordIdsComponentSelector } from '@/object-record/record-index/states/selectors/recordIndexAllRecordIdsComponentSelector';
import { recordStoreRecordsSelector } from '@/object-record/record-store/states/selectors/recordStoreRecordsSelector';
import { getRecordIndexIdFromObjectNamePluralAndViewId } from '@/object-record/utils/getRecordIndexIdFromObjectNamePluralAndViewId';
import { getCommandMenuPreviewRecordSelection } from '@/command-menu-item/server-items/common/utils/getCommandMenuPreviewRecordSelection';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { type CommandMenuContextApi } from 'twenty-shared/types';

export const useCommandMenuPreviewContextApi = (): CommandMenuContextApi => {
  const contextStoreInstanceId = useCommandMenuContextStoreInstanceId();

  const contextStoreCurrentObjectMetadataItemId = useAtomComponentStateValue(
    contextStoreCurrentObjectMetadataItemIdComponentState,
    contextStoreInstanceId,
  );

  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
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

  const commandMenuItemEditRecordSelectionPreviewMode = useAtomStateValue(
    commandMenuItemEditRecordSelectionPreviewModeState,
  );

  const { objectMetadataItems } = useObjectMetadataItems();
  const contextStoreObjectMetadataItem = objectMetadataItems.find(
    (item) => item.id === contextStoreCurrentObjectMetadataItemId,
  );

  const recordIndexId = getRecordIndexIdFromObjectNamePluralAndViewId(
    contextStoreObjectMetadataItem?.namePlural ?? '',
    contextStoreCurrentViewId ?? '',
  );

  const recordIdsInView = useAtomComponentSelectorValue(
    recordIndexAllRecordIdsComponentSelector,
    recordIndexId,
  );

  const {
    contextStorePreviewTargetedRecordsRule,
    contextStorePreviewNumberOfSelectedRecords,
  } = getCommandMenuPreviewRecordSelection({
    previewMode: commandMenuItemEditRecordSelectionPreviewMode,
    contextStoreTargetedRecordsRule,
    contextStoreNumberOfSelectedRecords,
    contextStoreRecordIds: recordIdsInView,
  });

  const recordIds =
    contextStorePreviewTargetedRecordsRule.mode === 'selection'
      ? contextStorePreviewTargetedRecordsRule.selectedRecordIds
      : undefined;

  const selectedRecords = useAtomFamilySelectorValue(
    recordStoreRecordsSelector,
    {
      recordIds: recordIds ?? [],
    },
  );

  const favoriteRecordIds = useCommandMenuFavoriteRecordIds({
    recordIds,
    objectMetadataItemId: contextStoreObjectMetadataItem?.id,
  });
  const objectPermissions = useCommandMenuObjectPermissions({
    objectMetadataItemId: contextStoreObjectMetadataItem?.id,
  });
  const featureFlags = useCommandMenuFeatureFlags();
  const { pageType, isPageInEditMode, hasAnySoftDeleteFilterOnView } =
    useCommandMenuPageContext({
      contextStoreInstanceId,
    });
  const { targetObjectReadPermissions, targetObjectWritePermissions } =
    useCommandMenuTargetObjectPermissions();

  const isSelectAll =
    contextStorePreviewTargetedRecordsRule.mode === 'exclusion';

  return {
    pageType,
    isInSidePanel: true,
    isPageInEditMode,
    favoriteRecordIds,
    isSelectAll,
    hasAnySoftDeleteFilterOnView,
    numberOfSelectedRecords: contextStorePreviewNumberOfSelectedRecords,
    objectPermissions,
    selectedRecords,
    featureFlags,
    targetObjectReadPermissions,
    targetObjectWritePermissions,
    objectMetadataItem: contextStoreObjectMetadataItem ?? {},
  };
};
