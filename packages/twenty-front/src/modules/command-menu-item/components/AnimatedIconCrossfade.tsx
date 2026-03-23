import { styled } from '@linaria/react';
import { motion } from 'framer-motion';
import { useContext } from 'react';
import { type IconComponent } from 'twenty-ui/display';
import { ThemeContext, themeCssVariables } from 'twenty-ui/theme-constants';

type AnimatedIconCrossfadeProps = {
  isToggled: boolean;
  DefaultIcon: IconComponent;
  ToggledIcon: IconComponent;
};

const StyledContainer = styled.div`
  height: calc(${themeCssVariables.icon.size.sm} * 1px);
  overflow: hidden;
  position: relative;
  width: calc(${themeCssVariables.icon.size.sm} * 1px);
`;

const StyledLayer = styled(motion.div)`
  align-items: center;
  display: flex;
  inset: 0;
  justify-content: center;
  position: absolute;
`;

export const AnimatedIconCrossfade = ({
  isToggled,
  DefaultIcon,
  ToggledIcon,
}: AnimatedIconCrossfadeProps) => {
  const { theme } = useContext(ThemeContext);

  return (
    <StyledContainer>
      <StyledLayer
        initial={false}
        animate={{
          opacity: isToggled ? 0 : 1,
          scale: isToggled ? 0.85 : 1,
        }}
        transition={{
          duration: theme.animation.duration.fast,
          ease: 'easeInOut',
        }}
      >
        <DefaultIcon size={theme.icon.size.sm} />
      </StyledLayer>
      <StyledLayer
        initial={false}
        animate={{
          opacity: isToggled ? 1 : 0,
          scale: isToggled ? 1 : 0.85,
        }}
        transition={{
          duration: theme.animation.duration.fast,
          ease: 'easeInOut',
        }}
      >
        <ToggledIcon size={theme.icon.size.sm} />
      </StyledLayer>
    </StyledContainer>
  );
};
