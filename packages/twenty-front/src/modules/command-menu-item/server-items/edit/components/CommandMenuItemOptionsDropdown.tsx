import { useUpdateCommandMenuItemInDraft } from '@/command-menu-item/server-items/edit/hooks/useUpdateCommandMenuItemInDraft';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { GenericDropdownContentWidth } from '@/ui/layout/dropdown/constants/GenericDropdownContentWidth';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useLingui } from '@lingui/react/macro';
import { type ReactElement } from 'react';
import { STANDARD_COMMAND_MENU_ITEM_DEFAULTS } from 'twenty-shared/command-menu';
import { IconRefresh, IconTag } from 'twenty-ui/display';
import { MenuItem, MenuItemToggle } from 'twenty-ui/navigation';

type CommandMenuItemOptionsDropdownProps = {
  itemId: string;
  engineComponentKey: string | null | undefined;
  isLabelHidden: boolean;
  hasShortLabelOverride: boolean;
  iconButton: ReactElement;
};

const getCommandMenuItemOptionsDropdownId = (itemId: string) =>
  `command-menu-item-options-${itemId}`;

export const CommandMenuItemOptionsDropdown = ({
  itemId,
  engineComponentKey,
  isLabelHidden,
  hasShortLabelOverride,
  iconButton,
}: CommandMenuItemOptionsDropdownProps) => {
  const { t } = useLingui();

  const dropdownId = getCommandMenuItemOptionsDropdownId(itemId);
  const { closeDropdown } = useCloseDropdown();
  const { updateCommandMenuItemInDraft } = useUpdateCommandMenuItemInDraft();

  const seededShortLabel = engineComponentKey
    ? (STANDARD_COMMAND_MENU_ITEM_DEFAULTS[engineComponentKey]?.shortLabel ??
      null)
    : null;

  const handleToggleHideLabel = (toggled: boolean) => {
    updateCommandMenuItemInDraft(itemId, {
      shortLabel: toggled ? null : seededShortLabel,
    });
  };

  const handleResetLabelToDefault = () => {
    updateCommandMenuItemInDraft(itemId, {
      shortLabel: seededShortLabel,
    });
    closeDropdown(dropdownId);
  };

  return (
    <Dropdown
      dropdownId={dropdownId}
      clickableComponent={iconButton}
      dropdownPlacement="bottom-end"
      dropdownComponents={
        <DropdownContent widthInPixels={GenericDropdownContentWidth.Medium}>
          <DropdownMenuItemsContainer>
            <MenuItemToggle
              LeftIcon={IconTag}
              text={t`Hide label`}
              toggled={isLabelHidden}
              onToggleChange={handleToggleHideLabel}
              toggleSize="small"
            />
          </DropdownMenuItemsContainer>
          <DropdownMenuItemsContainer>
            <MenuItem
              LeftIcon={IconRefresh}
              onClick={handleResetLabelToDefault}
              accent="default"
              text={t`Reset label to default`}
              disabled={!hasShortLabelOverride}
            />
          </DropdownMenuItemsContainer>
        </DropdownContent>
      }
    />
  );
};
