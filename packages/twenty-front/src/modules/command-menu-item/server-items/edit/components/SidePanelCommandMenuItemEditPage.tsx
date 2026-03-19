import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { CommandMenuItemDraggable } from '@/command-menu-item/server-items/components/CommandMenuItemDraggable';
import { CommandMenuItemOptionsDropdown } from '@/command-menu-item/server-items/edit/components/CommandMenuItemOptionsDropdown';
import { ContextScopeDropdown } from '@/command-menu-item/server-items/edit/components/ContextScopeDropdown';
import { useCommandMenuItemsDraftState } from '@/command-menu-item/server-items/edit/hooks/useCommandMenuItemsDraftState';
import { useReorderCommandMenuItemsInDraft } from '@/command-menu-item/server-items/edit/hooks/useReorderCommandMenuItemsInDraft';
import { useResetCommandMenuItemsDraft } from '@/command-menu-item/server-items/edit/hooks/useResetCommandMenuItemsDraft';
import { useUpdateCommandMenuItemInDraft } from '@/command-menu-item/server-items/edit/hooks/useUpdateCommandMenuItemInDraft';
import { useCommandMenuContextApi } from '@/command-menu-item/server-items/hooks/useCommandMenuContextApi';
import { SidePanelGroup } from '@/side-panel/components/SidePanelGroup';
import { SidePanelList } from '@/side-panel/components/SidePanelList';
import { DraggableItem } from '@/ui/layout/draggable-list/components/DraggableItem';
import { DraggableList } from '@/ui/layout/draggable-list/components/DraggableList';
import { SelectableListItem } from '@/ui/layout/selectable-list/components/SelectableListItem';
import { SidePanelFooter } from '@/ui/layout/side-panel/components/SidePanelFooter';
import { type DropResult } from '@hello-pangea/dnd';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useCallback, useContext, useMemo } from 'react';
import { STANDARD_COMMAND_MENU_ITEM_DEFAULTS } from 'twenty-shared/command-menu';
import { CommandMenuContextApiPageType } from 'twenty-shared/types';
import {
  interpolateCommandMenuItemLabel,
  isDefined,
} from 'twenty-shared/utils';
import {
  IconDotsVertical,
  IconPin,
  IconPinnedOff,
  IconRefresh,
  useIcons,
} from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const StyledViewbar = styled.div`
  align-items: center;
  backdrop-filter: blur(5px);
  border-bottom: 1px solid ${themeCssVariables.border.color.light};
  display: flex;
  flex-shrink: 0;
  height: 40px;
  padding: ${themeCssVariables.spacing[1]} ${themeCssVariables.spacing[2]};
`;

const StyledContent = styled.div`
  flex: 1;
  overflow: auto;
`;

export const SidePanelCommandMenuItemEditPage = () => {
  const { t } = useLingui();
  const { getIcon } = useIcons();
  const commandMenuContextApi = useCommandMenuContextApi();
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

  const makeOptionsDropdownWrapper = useCallback(
    (
      itemId: string,
      engineComponentKey: string | null | undefined,
      shortLabel: string | null | undefined,
    ) => {
      const seededShortLabel = engineComponentKey
        ? (STANDARD_COMMAND_MENU_ITEM_DEFAULTS[engineComponentKey]
            ?.shortLabel ?? null)
        : null;

      return ({ iconButton }: { iconButton: React.ReactElement }) => (
        <CommandMenuItemOptionsDropdown
          itemId={itemId}
          engineComponentKey={engineComponentKey}
          isLabelHidden={shortLabel === null && seededShortLabel !== null}
          hasShortLabelOverride={shortLabel !== seededShortLabel}
          iconButton={iconButton}
        />
      );
    },
    [],
  );

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

  const isIndexPage =
    commandMenuContextApi.pageType === CommandMenuContextApiPageType.INDEX_PAGE;

  return (
    <StyledContainer>
      {isIndexPage && (
        <StyledViewbar>
          <ContextScopeDropdown />
        </StyledViewbar>
      )}
      <StyledContent>
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
                          label={
                            interpolateCommandMenuItemLabel({
                              label: item.label,
                              context: commandMenuContextApi,
                            }) ?? item.label
                          }
                          Icon={ItemIcon}
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
                            {
                              Icon: IconDotsVertical,
                              Wrapper: makeOptionsDropdownWrapper(
                                item.id,
                                item.engineComponentKey,
                                item.shortLabel,
                              ),
                              onClick: () => {},
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
                    label={
                      interpolateCommandMenuItemLabel({
                        label: item.label,
                        context: commandMenuContextApi,
                      }) ?? item.label
                    }
                    Icon={ItemIcon}
                    isIconDisplayedOnHoverOnly={false}
                    iconButtons={[
                      {
                        Icon: IconPin,
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
        </SidePanelList>
      </StyledContent>
      <SidePanelFooter
        actions={[
          <Button
            key="reset"
            Icon={IconRefresh}
            title={t`Reset to default`}
            variant="secondary"
            accent="default"
            size="small"
            onClick={resetCommandMenuItemsDraft}
          />,
        ]}
      />
    </StyledContainer>
  );
};
