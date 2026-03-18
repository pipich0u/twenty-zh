import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { useLingui } from '@lingui/react/macro';
import { SidePanelPages } from 'twenty-shared/types';
import { IconPencil } from 'twenty-ui/display';
import { Button } from 'twenty-ui/input';
import { FeatureFlagKey } from '~/generated-metadata/graphql';

export const EditActionsButton = () => {
  const { t } = useLingui();
  const { navigateSidePanel } = useNavigateSidePanel();

  const isLayoutCustomizationModeEnabled = useAtomStateValue(
    isLayoutCustomizationModeEnabledState,
  );

  const isCommandMenuItemEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED,
  );

  if (!isLayoutCustomizationModeEnabled || !isCommandMenuItemEnabled) {
    return null;
  }

  const handleClick = () => {
    navigateSidePanel({
      page: SidePanelPages.CommandMenuItemEdit,
      pageTitle: t`Edit actions`,
      pageIcon: IconPencil,
      resetNavigationStack: true,
    });
  };

  return (
    <Button
      Icon={IconPencil}
      title={t`Edit actions`}
      variant="secondary"
      size="small"
      onClick={handleClick}
    />
  );
};
