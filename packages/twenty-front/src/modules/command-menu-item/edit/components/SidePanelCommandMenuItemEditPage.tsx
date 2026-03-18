import { CommandMenuItem } from '@/command-menu/components/CommandMenuItem';
import { CommandMenuItemDraggable } from '@/command-menu/components/CommandMenuItemDraggable';
import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { useCommandMenuItemsDraftState } from '@/command-menu-item/edit/hooks/useCommandMenuItemsDraftState';
import { useReorderCommandMenuItemsInDraft } from '@/command-menu-item/edit/hooks/useReorderCommandMenuItemsInDraft';
import { useResetCommandMenuItemsDraft } from '@/command-menu-item/edit/hooks/useResetCommandMenuItemsDraft';
import { useUpdateCommandMenuItemInDraft } from '@/command-menu-item/edit/hooks/useUpdateCommandMenuItemInDraft';
import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { DraggableItem } from '@/ui/layout/draggable-list/components/DraggableItem';
import { DraggableList } from '@/ui/layout/draggable-list/components/DraggableList';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { type DropResult } from '@hello-pangea/dnd';
import { useLingui } from '@lingui/react/macro';
import { useContext, useMemo, useState } from 'react';
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
  const { commandMenuItems: commandMenuItemsInCurrentContext } =
    useContext(CommandMenuContext);

  const { commandMenuItems } = useCommandMenuItemsDraftState();
  const { updateCommandMenuItemInDraft } = useUpdateCommandMenuItemInDraft();
  const { reorderCommandMenuItemInDraft } = useReorderCommandMenuItemsInDraft();
  const { resetCommandMenuItemsDraft } = useResetCommandMenuItemsDraft();

  const contextualCommandMenuItemIds = useMemo(
    () =>
      new Set(
        commandMenuItemsInCurrentContext
          .map((item) => item.sourceCommandMenuItemId)
          .filter(isDefined),
      ),
    [commandMenuItemsInCurrentContext],
  );

  const contextualCommandMenuItems = useMemo(
    () =>
      commandMenuItems.filter((item) =>
        contextualCommandMenuItemIds.has(item.id),
      ),
    [commandMenuItems, contextualCommandMenuItemIds],
  );

  const pinnedItems = useMemo(
    () =>
      contextualCommandMenuItems
        .filter((item) => item.isPinned)
        .sort((a, b) => a.position - b.position),
    [contextualCommandMenuItems],
  );

  const otherItems = useMemo(
    () =>
      contextualCommandMenuItems
        .filter((item) => !item.isPinned)
        .sort((a, b) => a.position - b.position),
    [contextualCommandMenuItems],
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
    if (currentlyPinned) {
      const nextOtherPosition =
        otherItems.length === 0
          ? 0
          : otherItems[otherItems.length - 1].position + 1;

      updateCommandMenuItemInDraft(itemId, {
        isPinned: false,
        position: nextOtherPosition,
      });

      return;
    }

    const nextPinnedPosition =
      pinnedItems.length === 0
        ? 0
        : pinnedItems[pinnedItems.length - 1].position + 1;

    updateCommandMenuItemInDraft(itemId, {
      isPinned: true,
      position: nextPinnedPosition,
    });
  };

  const handlePinnedDragEnd = (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!isDefined(destination)) {
      return;
    }

    if (source.index === destination.index) {
      return;
    }

    reorderCommandMenuItemInDraft(draggableId, destination.index, 'pinned');
  };

  return (
    <SidePanelList commandGroups={[]} selectableItemIds={selectableItemIds}>
      <SidePanelGroup heading={t`Pinned`}>
        <DraggableList
          onDragEnd={handlePinnedDragEnd}
          draggableItems={pinnedItems.map((item, index) => {
            const ItemIcon = isDefined(item.icon)
              ? getIcon(item.icon)
              : undefined;

            return (
              <DraggableItem
                key={item.id}
                draggableId={item.id}
                index={index}
                itemComponent={
                  <SelectableListItem
                    itemId={item.id}
                    onEnter={() => handleTogglePin(item.id, true)}
                  >
                    <CommandMenuItemDraggable
                      id={item.id}
                      label={item.label}
                      Icon={ItemIcon}
                      onClick={() => handleTogglePin(item.id, true)}
                      gripMode="onHover"
                      isIconDisplayedOnHoverOnly={false}
                      iconButtons={[
                        {
                          Icon: IconPinnedOff,
                          onClick: (event) => {
                            event.stopPropagation();
                            handleTogglePin(item.id, true);
                          },
                        },
                      ]}
                    />
                  </SelectableListItem>
                }
              />
            );
          })}
        />
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
              <CommandMenuItemDraggable
                id={item.id}
                label={item.label}
                Icon={ItemIcon}
                onClick={() => handleTogglePin(item.id, false)}
                isIconDisplayedOnHoverOnly={false}
                iconButtons={[
                  {
                    Icon: IconPinned,
                    onClick: (event) => {
                      event.stopPropagation();
                      handleTogglePin(item.id, false);
                    },
                  },
                ]}
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
