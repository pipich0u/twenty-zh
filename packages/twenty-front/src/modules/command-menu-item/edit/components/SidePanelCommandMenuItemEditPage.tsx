import { CommandMenuItem } from '@/command-menu/components/CommandMenuItem';
import { useCommandMenuItemsDraftState } from '@/command-menu-item/edit/hooks/useCommandMenuItemsDraftState';
import { useResetCommandMenuItemsDraft } from '@/command-menu-item/edit/hooks/useResetCommandMenuItemsDraft';
import { useUpdateCommandMenuItemInDraft } from '@/command-menu-item/edit/hooks/useUpdateCommandMenuItemInDraft';
import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { useLingui } from '@lingui/react/macro';
import { useMemo, useState } from 'react';
import { isDefined } from 'twenty-shared/utils';
import {
  IconPinned,
  IconPinnedOff,
  IconRefresh,
  useIcons,
} from 'twenty-ui/display';

const RESET_ACTION_ID = 'reset-pinned-commands';

export const SidePanelCommandMenuItemEditPage = () => {
  const { t } = useLingui();
  const { getIcon } = useIcons();
  const [_searchFilter, _setSearchFilter] = useState('');

  const { commandMenuItems } = useCommandMenuItemsDraftState();
  const { updateCommandMenuItemInDraft } = useUpdateCommandMenuItemInDraft();
  const { resetCommandMenuItemsDraft } = useResetCommandMenuItemsDraft();

  const pinnedItems = useMemo(
    () =>
      commandMenuItems
        .filter((item) => item.isPinned)
        .sort((a, b) => a.position - b.position),
    [commandMenuItems],
  );

  const otherItems = useMemo(
    () =>
      commandMenuItems
        .filter((item) => !item.isPinned)
        .sort((a, b) => a.position - b.position),
    [commandMenuItems],
  );

  const selectableItemIds = useMemo(
    () => [
      ...pinnedItems.map((item) => item.id),
      ...otherItems.map((item) => item.id),
      RESET_ACTION_ID,
    ],
    [pinnedItems, otherItems],
  );

  const handleTogglePin = (itemId: string, currentlyPinned: boolean) => {
    updateCommandMenuItemInDraft(itemId, { isPinned: !currentlyPinned });
  };

  return (
    <SidePanelList commandGroups={[]} selectableItemIds={selectableItemIds}>
      <SidePanelGroup heading={t`Pinned`}>
        {pinnedItems.map((item) => {
          const ItemIcon = isDefined(item.icon)
            ? getIcon(item.icon)
            : undefined;

          return (
            <SelectableListItem
              key={item.id}
              itemId={item.id}
              onEnter={() => handleTogglePin(item.id, true)}
            >
              <CommandMenuItem
                id={item.id}
                label={item.label}
                Icon={ItemIcon}
                onClick={() => handleTogglePin(item.id, true)}
                RightComponent={
                  <IconPinnedOff size={16} color="currentColor" />
                }
              />
            </SelectableListItem>
          );
        })}
      </SidePanelGroup>

      <SidePanelGroup heading={t`Other`}>
        {otherItems.map((item) => {
          const ItemIcon = isDefined(item.icon)
            ? getIcon(item.icon)
            : undefined;

          return (
            <SelectableListItem
              key={item.id}
              itemId={item.id}
              onEnter={() => handleTogglePin(item.id, false)}
            >
              <CommandMenuItem
                id={item.id}
                label={item.label}
                Icon={ItemIcon}
                onClick={() => handleTogglePin(item.id, false)}
                RightComponent={
                  <IconPinned size={16} color="currentColor" />
                }
              />
            </SelectableListItem>
          );
        })}
      </SidePanelGroup>

      <SelectableListItem
        itemId={RESET_ACTION_ID}
        onEnter={resetCommandMenuItemsDraft}
      >
        <CommandMenuItem
          id={RESET_ACTION_ID}
          label={t`Reset pinned commands`}
          Icon={IconRefresh}
          onClick={resetCommandMenuItemsDraft}
        />
      </SelectableListItem>
    </SidePanelList>
  );
};
