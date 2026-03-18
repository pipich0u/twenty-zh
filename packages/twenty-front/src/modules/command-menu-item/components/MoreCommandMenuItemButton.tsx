import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { SIDE_PANEL_TOP_BAR_HEIGHT_MOBILE } from '@/side-panel/constants/SidePanelTopBarHeightMobile';
import { useSidePanelMenu } from '@/side-panel/hooks/useSidePanelMenu';
import { isSidePanelOpenedState } from '@/side-panel/states/isSidePanelOpenedState';
import { RootStackingContextZIndices } from '@/ui/layout/constants/RootStackingContextZIndices';
import { PAGE_HEADER_SIDE_PANEL_BUTTON_CLICK_OUTSIDE_ID } from '@/ui/layout/page-header/constants/PageHeaderSidePanelButtonClickOutsideId';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { i18n } from '@lingui/core';
import { t } from '@lingui/core/macro';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import {
  AppTooltip,
  IconLayoutSidebarRightExpand,
  IconX,
  TooltipDelay,
  TooltipPosition,
} from 'twenty-ui/display';
import { AnimatedButton } from 'twenty-ui/input';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';
import { useIsMobile } from 'twenty-ui/utilities';
const StyledButtonWrapper = styled.div<{ alignToTop: boolean }>`
  align-items: ${({ alignToTop }) => (alignToTop ? 'center' : 'initial')};
  display: ${({ alignToTop }) => (alignToTop ? 'flex' : 'block')};
  height: ${({ alignToTop }) =>
    alignToTop ? `${SIDE_PANEL_TOP_BAR_HEIGHT_MOBILE}px` : 'auto'};
  position: ${({ alignToTop }) => (alignToTop ? 'fixed' : 'static')};
  right: ${({ alignToTop }) =>
    alignToTop ? themeCssVariables.spacing[3] : 'auto'};
  top: ${({ alignToTop }) => (alignToTop ? '0' : 'auto')};
  z-index: ${RootStackingContextZIndices.SidePanelButton};
`;

const StyledTooltipWrapper = styled.div`
  font-size: ${themeCssVariables.font.size.md};
`;

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

const MoreActionsAnimatedIcon = ({
  isSidePanelOpened,
}: {
  isSidePanelOpened: boolean;
}) => {
  const { theme } = useContext(ThemeContext);

  return (
    <StyledAnimatedIconContainer>
      <StyledAnimatedIconLayer
        initial={false}
        animate={{
          opacity: isSidePanelOpened ? 0 : 1,
          scale: isSidePanelOpened ? 0.85 : 1,
        }}
        transition={{
          duration: theme.animation.duration.fast,
          ease: 'easeInOut',
        }}
      >
        <IconLayoutSidebarRightExpand size={14} />
      </StyledAnimatedIconLayer>
      <StyledAnimatedIconLayer
        initial={false}
        animate={{
          opacity: isSidePanelOpened ? 1 : 0,
          scale: isSidePanelOpened ? 1 : 0.85,
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

export const MoreCommandMenuItemButton = () => {
  const { toggleSidePanelMenu } = useSidePanelMenu();
  const isSidePanelOpened = useAtomStateValue(isSidePanelOpenedState);
  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );

  const isMobile = useIsMobile();

  const alignWithSidePanelTopBar =
    isMobile && isLayoutCustomizationModeEnabled && isSidePanelOpened;

  const ariaLabel = isSidePanelOpened
    ? t`Close side panel`
    : t`Open side panel`;

  return (
    <StyledButtonWrapper alignToTop={alignWithSidePanelTopBar}>
      <div id="toggle-side-panel-button">
        <AnimatedButton
          animatedSvg={
            <MoreActionsAnimatedIcon isSidePanelOpened={isSidePanelOpened} />
          }
          dataClickOutsideId={PAGE_HEADER_SIDE_PANEL_BUTTON_CLICK_OUTSIDE_ID}
          dataTestId="page-header-side-panel-button"
          size={isMobile ? 'medium' : 'small'}
          variant="secondary"
          accent="default"
          title={t`More`}
          ariaLabel={ariaLabel}
          onClick={toggleSidePanelMenu}
        />
      </div>

      <StyledTooltipWrapper>
        <AppTooltip
          anchorSelect="#toggle-side-panel-button"
          content={i18n._(ariaLabel)}
          delay={TooltipDelay.longDelay}
          place={TooltipPosition.Bottom}
          offset={5}
          noArrow
        />
      </StyledTooltipWrapper>
    </StyledButtonWrapper>
  );
};
