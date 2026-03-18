import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { type CommandMenuItemConfig } from '@/command-menu-item/types/CommandMenuItemConfig';
import { CommandMenuItemScope } from '@/command-menu-item/types/CommandMenuItemScope';
import { CommandMenuItemType } from '@/command-menu-item/types/CommandMenuItemType';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { SIDE_PANEL_PREVIOUS_COMPONENT_INSTANCE_ID } from '@/side-panel/constants/SidePanelPreviousComponentInstanceId';
import { SIDE_PANEL_RESET_CONTEXT_TO_SELECTION } from '@/side-panel/constants/SidePanelResetContextToSelection';
import { SidePanelResetContextToSelectionButton } from '@/side-panel/pages/root/components/SidePanelResetContextToSelectionButton';
import { useFilterActionsWithSidePanelSearch } from '@/side-panel/pages/root/hooks/useFilterActionsWithSidePanelSearch';
import { sidePanelSearchState } from '@/side-panel/states/sidePanelSearchState';
import { type SidePanelCommandMenuItemGroupConfig } from '@/side-panel/types/SidePanelCommandMenuItemGroupConfig';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useLingui } from '@lingui/react/macro';
import { useContext, useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';

const sortByPosition = (items: CommandMenuItemConfig[]) =>
  [...items].sort((a, b) => a.position - b.position);

export const SidePanelCommandMenuItemDisplayPage = () => {
  const { t } = useLingui();

  const sidePanelSearch = useAtomStateValue(sidePanelSearchState);
  const { objectMetadataItems } = useObjectMetadataItems();

  const { commandMenuItems } = useContext(CommandMenuContext);

  const { filterActionsWithSidePanelSearch } =
    useFilterActionsWithSidePanelSearch({
      sidePanelSearch,
    });

  const {
    navigateActions,
    recordSelectionActions,
    objectActions,
    globalActions,
    fallbackActions,
    createRelatedRecordActions,
  } = useMemo(() => {
    const navigate: CommandMenuItemConfig[] = [];
    const recordSelection: CommandMenuItemConfig[] = [];
    const object: CommandMenuItemConfig[] = [];
    const global: CommandMenuItemConfig[] = [];
    const fallback: CommandMenuItemConfig[] = [];
    const createRelated: CommandMenuItemConfig[] = [];

    for (const item of commandMenuItems) {
      switch (item.type) {
        case CommandMenuItemType.Navigation:
          navigate.push(item);
          break;
        case CommandMenuItemType.Fallback:
          fallback.push(item);
          break;
        default:
          switch (item.scope) {
            case CommandMenuItemScope.RecordSelection:
              recordSelection.push(item);
              break;
            case CommandMenuItemScope.Object:
              object.push(item);
              break;
            case CommandMenuItemScope.Global:
              global.push(item);
              break;
            case CommandMenuItemScope.CreateRelatedRecord:
              createRelated.push(item);
              break;
          }
      }
    }

    return {
      navigateActions: navigate,
      recordSelectionActions: recordSelection,
      objectActions: object,
      globalActions: global,
      fallbackActions: fallback,
      createRelatedRecordActions: createRelated,
    };
  }, [commandMenuItems]);

  // oxlint-disable-next-line twenty/matching-state-variable
  const previousContextStoreCurrentObjectMetadataItemId =
    useAtomComponentStateValue(
      contextStoreCurrentObjectMetadataItemIdComponentState,
      SIDE_PANEL_PREVIOUS_COMPONENT_INSTANCE_ID,
    );

  const contextStoreCurrentObjectMetadataItemId = useAtomComponentStateValue(
    contextStoreCurrentObjectMetadataItemIdComponentState,
  );

  const currentObjectMetadataItem = objectMetadataItems.find(
    (item) => item.id === contextStoreCurrentObjectMetadataItemId,
  );

  const matchingRecordSelectionActions = filterActionsWithSidePanelSearch(
    recordSelectionActions,
  );
  const matchingObjectActions =
    filterActionsWithSidePanelSearch(objectActions);
  const matchingGlobalActions = filterActionsWithSidePanelSearch([
    ...globalActions,
    ...navigateActions,
  ]);
  const matchingCreateRelatedRecordActions = filterActionsWithSidePanelSearch(
    createRelatedRecordActions,
  );

  const noResults =
    !matchingRecordSelectionActions.length &&
    !matchingObjectActions.length &&
    !matchingGlobalActions.length &&
    !matchingCreateRelatedRecordActions.length;

  const commandGroups: SidePanelCommandMenuItemGroupConfig[] = [
    {
      heading: t`Record Selection`,
      items: sortByPosition(matchingRecordSelectionActions),
    },
    {
      heading: t`Create Related Record`,
      items: matchingCreateRelatedRecordActions,
    },
    {
      heading: currentObjectMetadataItem?.labelPlural ?? t`Object`,
      items: matchingObjectActions,
    },
    {
      heading: t`Global`,
      items: sortByPosition(matchingGlobalActions),
    },
    {
      heading: t`Search ''${sidePanelSearch}'' with...`,
      items: noResults ? fallbackActions : [],
    },
  ];

  const selectableItems = commandGroups.flatMap((group) => group.items ?? []);

  const selectableItemIds = selectableItems.map((item) => item.key);

  if (isDefined(previousContextStoreCurrentObjectMetadataItemId)) {
    selectableItemIds.unshift(SIDE_PANEL_RESET_CONTEXT_TO_SELECTION);
  }

  return (
    <SidePanelList
      commandGroups={commandGroups}
      selectableItemIds={selectableItemIds}
      noResults={noResults}
    >
      {isDefined(previousContextStoreCurrentObjectMetadataItemId) && (
        <SidePanelGroup heading={t`Context`}>
          <SidePanelResetContextToSelectionButton />
        </SidePanelGroup>
      )}
    </SidePanelList>
  );
};
