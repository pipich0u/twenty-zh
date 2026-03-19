import { CommandMenuItemComponent } from '@/command-menu-item/display/components/CommandMenuItemComponent';
import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { styled } from '@linaria/react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { ThemeContext } from 'twenty-ui/theme-constants';

const StyledActionContainer = styled(motion.div)`
  align-items: center;
  display: flex;
  justify-content: center;
`;

export const PinnedCommandMenuItemButtons = () => {
  const { theme } = useContext(ThemeContext);
  const { commandMenuItems } = useContext(CommandMenuContext);
  const pinnedActions = commandMenuItems.filter((entry) => entry.isPinned);

  return (
    <>
      {pinnedActions.map((action) => (
        <StyledActionContainer
          key={action.key}
          layout
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 'unset', opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{
            duration: theme.animation.duration.instant,
            ease: 'easeInOut',
          }}
        >
          <CommandMenuItemComponent action={action} />
        </StyledActionContainer>
      ))}
    </>
  );
};
