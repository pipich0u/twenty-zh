import { isNonEmptyString } from '@sniptt/guards';
import { IconArrowUpRight, type IconComponent } from 'twenty-ui/display';
import {
  MenuItemDraggable,
  type MenuItemDraggableGripMode,
  type MenuItemIconButton,
} from 'twenty-ui/navigation';

import { useCommandMenuOnItemClick } from '@/command-menu/hooks/useCommandMenuOnItemClick';

export type CommandMenuItemDraggableProps = {
  label: string;
  description?: string;
  to?: string;
  id: string;
  onClick?: () => void;
  Icon?: IconComponent;
  iconButtons?: MenuItemIconButton[];
  disabled?: boolean;
  gripMode?: MenuItemDraggableGripMode;
  isDragDisabled?: boolean;
  isIconDisplayedOnHoverOnly?: boolean;
};

export const CommandMenuItemDraggable = ({
  label,
  description,
  to,
  id: _id,
  onClick,
  Icon,
  iconButtons,
  disabled = false,
  gripMode = 'never',
  isDragDisabled = false,
  isIconDisplayedOnHoverOnly = true,
}: CommandMenuItemDraggableProps) => {
  const { onItemClick } = useCommandMenuOnItemClick();

  if (isNonEmptyString(to) && !Icon) {
    Icon = IconArrowUpRight;
  }

  return (
    <MenuItemDraggable
      withIconContainer
      LeftIcon={Icon}
      text={label}
      contextualText={description}
      iconButtons={iconButtons}
      isDragDisabled={disabled || isDragDisabled}
      gripMode={gripMode}
      isIconDisplayedOnHoverOnly={isIconDisplayedOnHoverOnly}
      onClick={
        disabled
          ? undefined
          : onClick || to
            ? () =>
                onItemClick({
                  onClick,
                  to,
                })
            : undefined
      }
    />
  );
};
