import { useUpdateCommandMenuItemInDraft } from '@/command-menu-item/server-items/edit/hooks/useUpdateCommandMenuItemInDraft';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { GenericDropdownContentWidth } from '@/ui/layout/dropdown/constants/GenericDropdownContentWidth';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useLingui } from '@lingui/react/macro';
import { type ReactElement } from 'react';
import { IconRefresh, IconTag } from 'twenty-ui/display';
import { MenuItem, MenuItemToggle } from 'twenty-ui/navigation';
import { type CommandMenuItemFieldsFragment } from '~/generated-metadata/graphql';

type CommandMenuItemOptionsDropdownProps = Pick<
  CommandMenuItemFieldsFragment,
  'shortLabel'
> & {
  itemId: string;
  defaultShortLabel: string | null;
  hasDefaultValues: boolean;
  isLoadingCommandMenuItemDefaultValues: boolean;
  iconButton: ReactElement;
};

const getCommandMenuItemOptionsDropdownId = (itemId: string) =>
  `command-menu-item-options-${itemId}`;

export const CommandMenuItemOptionsDropdown = ({
  itemId,
  shortLabel,
  defaultShortLabel,
  hasDefaultValues,
  isLoadingCommandMenuItemDefaultValues,
  iconButton,
}: CommandMenuItemOptionsDropdownProps) => {
  const { t } = useLingui();

  const dropdownId = getCommandMenuItemOptionsDropdownId(itemId);
  const { closeDropdown } = useCloseDropdown();
  const { updateCommandMenuItemInDraft } = useUpdateCommandMenuItemInDraft();

  const normalizedShortLabel = shortLabel ?? null;
  const seededShortLabel = defaultShortLabel;
  const isLabelHidden =
    hasDefaultValues &&
    normalizedShortLabel === null &&
    seededShortLabel !== null;
  const hasShortLabelOverride =
    hasDefaultValues && normalizedShortLabel !== seededShortLabel;
  const isDefaultValueActionDisabled =
    isLoadingCommandMenuItemDefaultValues || !hasDefaultValues;

  const handleToggleHideLabel = (toggled: boolean) => {
    if (!hasDefaultValues) {
      return;
    }

    updateCommandMenuItemInDraft(itemId, {
      shortLabel: toggled ? null : seededShortLabel,
    });
  };

  const handleResetLabelToDefault = () => {
    if (!hasDefaultValues) {
      return;
    }

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
              disabled={isDefaultValueActionDisabled}
            />
          </DropdownMenuItemsContainer>
          <DropdownMenuItemsContainer>
            <MenuItem
              LeftIcon={IconRefresh}
              onClick={handleResetLabelToDefault}
              accent="default"
              text={t`Reset label to default`}
              disabled={isDefaultValueActionDisabled || !hasShortLabelOverride}
            />
          </DropdownMenuItemsContainer>
        </DropdownContent>
      }
    />
  );
};
