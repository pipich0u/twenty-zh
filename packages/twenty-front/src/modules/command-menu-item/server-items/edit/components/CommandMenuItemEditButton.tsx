import { commandMenuItemEditRecordSelectionPreviewModeState } from '@/command-menu-item/server-items/edit/states/commandMenuItemEditRecordSelectionPreviewModeState';
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { SIDE_PANEL_COMPONENT_INSTANCE_ID } from '@/side-panel/constants/SidePanelComponentInstanceId';
import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { useSidePanelMenu } from '@/side-panel/hooks/useSidePanelMenu';
import { isSidePanelOpenedState } from '@/side-panel/states/isSidePanelOpenedState';
import { sidePanelPageState } from '@/side-panel/states/sidePanelPageState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { motion } from 'framer-motion';
import { useStore } from 'jotai';
import { useContext } from 'react';
import { SidePanelPages } from 'twenty-shared/types';
import { IconPencil, IconX } from 'twenty-ui/display';
import { AnimatedButton } from 'twenty-ui/input';
import { ThemeContext } from 'twenty-ui/theme-constants';
import { FeatureFlagKey } from '~/generated-metadata/graphql';

const StyledAnimatedIconContainer = styled.div`
  height: 14px;
  overflow: hidden;
  position: relative;
  width: 14px;
`;

const StyledAnimatedIconLayer = styled(motion.div)`
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  position: absolute;
`;

const CommandMenuItemEditAnimatedIcon = ({
  isCommandMenuEditPageActive,
}: {
  isCommandMenuEditPageActive: boolean;
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <StyledAnimatedIconContainer>
      <StyledAnimatedIconLayer
        initial={false}
        animate={{
          opacity: isCommandMenuEditPageActive ? 0 : 1,
          scale: isCommandMenuEditPageActive ? 0.85 : 1,
        }}
        transition={{
          duration: theme.animation.duration.fast,
          ease: 'easeInOut',
        }}
      >
        <IconPencil size={14} />
      </StyledAnimatedIconLayer>
      <StyledAnimatedIconLayer
        initial={false}
        animate={{
          opacity: isCommandMenuEditPageActive ? 1 : 0,
          scale: isCommandMenuEditPageActive ? 1 : 0.85,
        }}
        transition={{
          duration: theme.animation.duration.fast,
          ease: 'easeInOut',
        }}
      >
        <IconX size={14} />
      </StyledAnimatedIconLayer>
    </StyledAnimatedIconContainer>
  );
};

export const CommandMenuItemEditButton = () => {
  const { t } = useLingui();
  const store = useStore();
  const { navigateSidePanel } = useNavigateSidePanel();
  const { closeSidePanelMenu } = useSidePanelMenu();

  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );
  const isSidePanelOpened = useAtomStateValue(isSidePanelOpenedState);
  const sidePanelPage = useAtomStateValue(sidePanelPageState);

  const isCommandMenuItemEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED,
  );

  const isCommandMenuEditPageActive =
    isSidePanelOpened && sidePanelPage === SidePanelPages.CommandMenuEdit;

  if (!isLayoutCustomizationModeEnabled || !isCommandMenuItemEnabled) {
    return null;
  }

  const handleClick = () => {
    if (isCommandMenuEditPageActive) {
      closeSidePanelMenu();

      return;
    }

    store.set(
      commandMenuItemEditRecordSelectionPreviewModeState.atomFamily({
        instanceId: SIDE_PANEL_COMPONENT_INSTANCE_ID,
      }),
      'auto',
    );

    navigateSidePanel({
      page: SidePanelPages.CommandMenuEdit,
      pageTitle: t`Edit actions`,
      pageIcon: IconPencil,
      resetNavigationStack: true,
    });
  };

  return (
    <AnimatedButton
      animatedSvg={
        <CommandMenuItemEditAnimatedIcon
          isCommandMenuEditPageActive={isCommandMenuEditPageActive}
        />
      }
      title={t`Edit actions`}
      variant="secondary"
      size="small"
      onClick={handleClick}
    />
  );
};
