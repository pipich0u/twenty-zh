import { commandMenuItemsDraftState } from '@/command-menu-item/edit/states/commandMenuItemsDraftState';
import { commandMenuItemsSelector } from '@/command-menu-item/states/commandMenuItemsSelector';
import { activeCustomizationPageLayoutIdsState } from '@/layout-customization/states/activeCustomizationPageLayoutIdsState';
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { filterWorkspaceNavigationMenuItems } from '@/navigation-menu-item/common/utils/filterWorkspaceNavigationMenuItems';
import { navigationMenuItemsDraftState } from '@/navigation-menu-item/common/states/navigationMenuItemsDraftState';
import { navigationMenuItemsSelector } from '@/navigation-menu-item/common/states/navigationMenuItemsSelector';
import { sidePanelPageState } from '@/side-panel/states/sidePanelPageState';
import { isSidePanelOpenedState } from '@/side-panel/states/isSidePanelOpenedState';
import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { t } from '@lingui/core/macro';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { SidePanelPages } from 'twenty-shared/types';
import { IconPencil } from 'twenty-ui/display';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from '~/generated-metadata/graphql';

export const useEnterLayoutCustomizationMode = () => {
  const store = useStore();
  const { navigateSidePanel } = useNavigateSidePanel();
  const isCommandMenuItemEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED,
  );

  const enterLayoutCustomizationMode = useCallback(() => {
    const isLayoutCustomizationModeAlreadyEnabled = store.get(
      isLayoutCustomizationModeEnabledState.atom,
    );

    if (isLayoutCustomizationModeAlreadyEnabled) {
      return;
    }

    const prefetchNavigationMenuItems = store.get(
      navigationMenuItemsSelector.atom,
    );
    const workspaceNavigationMenuItems = filterWorkspaceNavigationMenuItems(
      prefetchNavigationMenuItems,
    );
    store.set(navigationMenuItemsDraftState.atom, workspaceNavigationMenuItems);

    const persistedCommandMenuItems = store.get(commandMenuItemsSelector.atom);
    store.set(commandMenuItemsDraftState.atom, persistedCommandMenuItems);

    store.set(activeCustomizationPageLayoutIdsState.atom, []);

    store.set(isLayoutCustomizationModeEnabledState.atom, true);

    const isSidePanelOpened = store.get(isSidePanelOpenedState.atom);
    const currentSidePanelPage = store.get(sidePanelPageState.atom);

    if (
      isCommandMenuItemEnabled &&
      isSidePanelOpened &&
      currentSidePanelPage === SidePanelPages.Root
    ) {
      navigateSidePanel({
        page: SidePanelPages.CommandMenuItemEdit,
        pageTitle: t`Edit actions`,
        pageIcon: IconPencil,
        resetNavigationStack: true,
      });
    }
  }, [isCommandMenuItemEnabled, navigateSidePanel, store]);

  return { enterLayoutCustomizationMode };
};
