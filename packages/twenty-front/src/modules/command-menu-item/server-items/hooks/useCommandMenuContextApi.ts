import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { objectPermissionsFamilySelector } from '@/auth/states/objectPermissionsFamilySelector';
import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { COMMAND_MENU_EDIT_MULTIPLE_RECORDS_PREVIEW_COUNT } from '@/command-menu-item/server-items/edit/constants/COMMAND_MENU_EDIT_MULTIPLE_RECORDS_PREVIEW_COUNT';
import { commandMenuEditRecordSelectionPreviewModeState } from '@/command-menu-item/server-items/edit/states/commandMenuEditRecordSelectionPreviewModeState';
import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { contextStoreCurrentViewTypeComponentState } from '@/context-store/states/contextStoreCurrentViewTypeComponentState';
import { contextStoreIsPageInEditModeComponentState } from '@/context-store/states/contextStoreIsPageInEditModeComponentState';
import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import {
  contextStoreTargetedRecordsRuleComponentState,
  type ContextStoreTargetedRecordsRule,
} from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { ContextStoreViewType } from '@/context-store/types/ContextStoreViewType';
import { useNavigationMenuItemsData } from '@/navigation-menu-item/display/hooks/useNavigationMenuItemsData';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { useObjectPermissionsForObject } from '@/object-record/hooks/useObjectPermissionsForObject';
import { hasAnySoftDeleteFilterOnViewComponentSelector } from '@/object-record/record-filter/states/hasAnySoftDeleteFilterOnView';
import { useRecordIndexIdFromCurrentContextStore } from '@/object-record/record-index/hooks/useRecordIndexIdFromCurrentContextStore';
import { recordIndexAllRecordIdsComponentSelector } from '@/object-record/record-index/states/selectors/recordIndexAllRecordIdsComponentSelector';
import { recordStoreRecordsSelector } from '@/object-record/record-store/states/selectors/recordStoreRecordsSelector';
import { getRecordIndexIdFromObjectNamePluralAndViewId } from '@/object-record/utils/getRecordIndexIdFromObjectNamePluralAndViewId';
import { sidePanelPageState } from '@/side-panel/states/sidePanelPageState';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isNonEmptyArray } from '@sniptt/guards';
import { useAtomValue, useStore } from 'jotai';
import { useContext, useMemo } from 'react';
import {
  CommandMenuContextApiPageType,
  SidePanelPages,
  type CommandMenuContextApi,
} from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

export const useCommandMenuContextApi = ({
  isInSidePanelOverride,
}: {
  isInSidePanelOverride?: boolean;
} = {}): CommandMenuContextApi => {
  const store = useStore();

  const commandMenuContext = useContext(CommandMenuContext);
  const isInSidePanel = isDefined(isInSidePanelOverride)
    ? isInSidePanelOverride
    : commandMenuContext.isInSidePanel;

  const contextStoreCurrentObjectMetadataItemId = useAtomComponentStateValue(
    contextStoreCurrentObjectMetadataItemIdComponentState,
  );

  const contextStoreTargetedRecordsRule = useAtomComponentStateValue(
    contextStoreTargetedRecordsRuleComponentState,
  );

  const contextStoreNumberOfSelectedRecords = useAtomComponentStateValue(
    contextStoreNumberOfSelectedRecordsComponentState,
  );

  const mainContextStoreTargetedRecordsRule = useAtomValue(
    contextStoreTargetedRecordsRuleComponentState.atomFamily({
      instanceId: MAIN_CONTEXT_STORE_INSTANCE_ID,
    }),
  );

  const mainContextStoreNumberOfSelectedRecords = useAtomValue(
    contextStoreNumberOfSelectedRecordsComponentState.atomFamily({
      instanceId: MAIN_CONTEXT_STORE_INSTANCE_ID,
    }),
  );

  const mainContextStoreCurrentObjectMetadataItemId = useAtomValue(
    contextStoreCurrentObjectMetadataItemIdComponentState.atomFamily({
      instanceId: MAIN_CONTEXT_STORE_INSTANCE_ID,
    }),
  );

  const mainContextStoreCurrentViewId = useAtomValue(
    contextStoreCurrentViewIdComponentState.atomFamily({
      instanceId: MAIN_CONTEXT_STORE_INSTANCE_ID,
    }),
  );

  const { objectMetadataItems } = useObjectMetadataItems();

  const commandMenuEditRecordSelectionPreviewMode = useAtomComponentStateValue(
    commandMenuEditRecordSelectionPreviewModeState,
  );

  const sidePanelPage = useAtomStateValue(sidePanelPageState);

  const shouldUseCommandMenuEditPreviewMode =
    isInSidePanel && sidePanelPage === SidePanelPages.CommandMenuEdit;
  const shouldUseMainContextForCommandMenuDisplay =
    isInSidePanel && sidePanelPage === SidePanelPages.CommandMenuDisplay;

  const mainContextObjectMetadataItem = objectMetadataItems.find(
    (item) => item.id === mainContextStoreCurrentObjectMetadataItemId,
  );

  const mainRecordIndexId = getRecordIndexIdFromObjectNamePluralAndViewId(
    mainContextObjectMetadataItem?.namePlural ?? '',
    mainContextStoreCurrentViewId ?? '',
  );

  const mainRecordIds = useAtomComponentSelectorValue(
    recordIndexAllRecordIdsComponentSelector,
    mainRecordIndexId,
  );

  const mainSingleSelectedRecordId =
    mainContextStoreTargetedRecordsRule.mode === 'selection' &&
    mainContextStoreTargetedRecordsRule.selectedRecordIds.length >= 1
      ? mainContextStoreTargetedRecordsRule.selectedRecordIds[0]
      : mainRecordIds[0];

  const effectiveContextStoreTargetedRecordsRule: ContextStoreTargetedRecordsRule =
    useMemo(() => {
      if (!shouldUseCommandMenuEditPreviewMode) {
        if (shouldUseMainContextForCommandMenuDisplay) {
          return mainContextStoreTargetedRecordsRule;
        }

        return contextStoreTargetedRecordsRule;
      }

      if (commandMenuEditRecordSelectionPreviewMode === 'auto') {
        return mainContextStoreTargetedRecordsRule;
      }

      if (commandMenuEditRecordSelectionPreviewMode === 'none') {
        return {
          mode: 'selection',
          selectedRecordIds: [],
        };
      }

      if (commandMenuEditRecordSelectionPreviewMode === 'single') {
        return {
          mode: 'selection',
          selectedRecordIds: isDefined(mainSingleSelectedRecordId)
            ? [mainSingleSelectedRecordId]
            : [],
        };
      }

      return {
        mode: 'selection',
        selectedRecordIds: [],
      };
    }, [
      commandMenuEditRecordSelectionPreviewMode,
      contextStoreTargetedRecordsRule,
      mainContextStoreTargetedRecordsRule,
      mainSingleSelectedRecordId,
      shouldUseCommandMenuEditPreviewMode,
      shouldUseMainContextForCommandMenuDisplay,
    ]);

  const effectiveContextStoreNumberOfSelectedRecords = useMemo(() => {
    if (!shouldUseCommandMenuEditPreviewMode) {
      if (shouldUseMainContextForCommandMenuDisplay) {
        return mainContextStoreNumberOfSelectedRecords;
      }

      return contextStoreNumberOfSelectedRecords;
    }

    if (commandMenuEditRecordSelectionPreviewMode === 'auto') {
      return mainContextStoreNumberOfSelectedRecords;
    }

    if (commandMenuEditRecordSelectionPreviewMode === 'none') {
      return 0;
    }

    if (commandMenuEditRecordSelectionPreviewMode === 'single') {
      return 1;
    }

    return COMMAND_MENU_EDIT_MULTIPLE_RECORDS_PREVIEW_COUNT;
  }, [
    commandMenuEditRecordSelectionPreviewMode,
    contextStoreNumberOfSelectedRecords,
    mainContextStoreNumberOfSelectedRecords,
    mainSingleSelectedRecordId,
    shouldUseCommandMenuEditPreviewMode,
    shouldUseMainContextForCommandMenuDisplay,
  ]);

  const objectMetadataItem = objectMetadataItems.find(
    (item) => item.id === contextStoreCurrentObjectMetadataItemId,
  );

  const { navigationMenuItems } = useNavigationMenuItemsData();

  const recordIds =
    effectiveContextStoreTargetedRecordsRule.mode === 'selection'
      ? effectiveContextStoreTargetedRecordsRule.selectedRecordIds
      : undefined;

  const favoriteRecordIds = (() => {
    if (!isNonEmptyArray(recordIds) || !isDefined(objectMetadataItem)) {
      return [];
    }

    return recordIds.filter((recordId) =>
      navigationMenuItems?.some(
        (item) =>
          item.targetRecordId === recordId &&
          item.targetObjectMetadataId === objectMetadataItem.id,
      ),
    );
  })();

  const selectedRecords = useAtomFamilySelectorValue(
    recordStoreRecordsSelector,
    { recordIds: recordIds ?? [] },
  );

  const objectPermissionsFromHook = useObjectPermissionsForObject(
    objectMetadataItem?.id ?? '',
  );
  const objectPermissions = isDefined(objectMetadataItem)
    ? objectPermissionsFromHook
    : {
        canReadObjectRecords: false,
        canUpdateObjectRecords: false,
        canSoftDeleteObjectRecords: false,
        canDestroyObjectRecords: false,
        restrictedFields: {},
        objectMetadataId: '',
        rowLevelPermissionPredicates: [],
        rowLevelPermissionPredicateGroups: [],
      };

  const { recordIndexId } = useRecordIndexIdFromCurrentContextStore();

  const hasAnySoftDeleteFilterOnView = useAtomComponentSelectorValue(
    hasAnySoftDeleteFilterOnViewComponentSelector,
    recordIndexId,
  );

  const contextStoreCurrentViewType = useAtomComponentStateValue(
    contextStoreCurrentViewTypeComponentState,
  );

  const contextStoreIsPageInEditMode = useAtomComponentStateValue(
    contextStoreIsPageInEditModeComponentState,
  );

  const pageType =
    contextStoreCurrentViewType === ContextStoreViewType.ShowPage
      ? CommandMenuContextApiPageType.RECORD_PAGE
      : CommandMenuContextApiPageType.INDEX_PAGE;

  const isSelectAll =
    effectiveContextStoreTargetedRecordsRule.mode === 'exclusion';

  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const featureFlags: Record<string, boolean> = {};

  for (const flag of currentWorkspace?.featureFlags ?? []) {
    featureFlags[flag.key] = flag.value === true;
  }

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
    pageType,
    isInSidePanel,
    isPageInEditMode: contextStoreIsPageInEditMode,
    favoriteRecordIds,
    isSelectAll,
    hasAnySoftDeleteFilterOnView,
    numberOfSelectedRecords: effectiveContextStoreNumberOfSelectedRecords,
    objectPermissions,
    selectedRecords,
    featureFlags,
    targetObjectReadPermissions,
    targetObjectWritePermissions,
    objectMetadataItem: objectMetadataItem ?? {},
  };
};
