import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
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

export const SidePanelCommandMenuItemDisplayPage = () => {
  const { t } = useLingui();

  const sidePanelSearch = useAtomStateValue(sidePanelSearchState);
  const { commandMenuItems } = useContext(CommandMenuContext);

  const { filterActionsWithSidePanelSearch } =
    useFilterActionsWithSidePanelSearch({
      sidePanelSearch,
    });

  const pinnedItems = useMemo(
    () =>
      [...commandMenuItems]
        .filter((item) => item.isPinned)
        .sort((a, b) => a.position - b.position),
    [commandMenuItems],
  );

  const otherItems = useMemo(
    () =>
      [...commandMenuItems]
        .filter((item) => !item.isPinned)
        .sort((a, b) => a.position - b.position),
    [commandMenuItems],
  );

  const matchingPinnedItems = filterActionsWithSidePanelSearch(pinnedItems);
  const matchingOtherItems = filterActionsWithSidePanelSearch(otherItems);

  const noResults = !matchingPinnedItems.length && !matchingOtherItems.length;

  const commandGroups: SidePanelCommandMenuItemGroupConfig[] = [
    {
      heading: t`Pinned`,
      items: matchingPinnedItems,
    },
    {
      heading: t`Other`,
      items: matchingOtherItems,
    },
  ];

  const selectableItems = commandGroups.flatMap((group) => group.items ?? []);
  const selectableItemIds = selectableItems.map((item) => item.key);

  // oxlint-disable-next-line twenty/matching-state-variable
  const previousContextStoreCurrentObjectMetadataItemId =
    useAtomComponentStateValue(
      contextStoreCurrentObjectMetadataItemIdComponentState,
      SIDE_PANEL_PREVIOUS_COMPONENT_INSTANCE_ID,
    );

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
