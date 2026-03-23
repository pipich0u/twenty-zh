import { useLingui } from '@lingui/react/macro';
import { useStore } from 'jotai';
import { SidePanelPages } from 'twenty-shared/types';
import { IconColumnInsertRight } from 'twenty-ui/display';

import { addMenuItemInsertionContextState } from '@/navigation-menu-item/common/states/addMenuItemInsertionContextState';
import { selectedNavigationMenuItemInEditModeState } from '@/navigation-menu-item/common/states/selectedNavigationMenuItemInEditModeState';
import { pushNewSidebarItemMainMenuSubPage } from '@/navigation-menu-item/edit/utils/pushNewSidebarItemMainMenuSubPage';
import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { sidePanelPageState } from '@/side-panel/states/sidePanelPageState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { useSetAtomState } from '@/ui/utilities/state/jotai/hooks/useSetAtomState';

type OpenAddItemToFolderPageParams = {
  targetFolderId: string;
  targetIndex: number;
  resetNavigationStack?: boolean;
  shouldHighlightDrawerAddMenuItem?: boolean;
};

export const useOpenAddItemToFolderPage = () => {
  const { t } = useLingui();
  const store = useStore();
  const { navigateSidePanel } = useNavigateSidePanel();
  const sidePanelPage = useAtomStateValue(sidePanelPageState);
  const setAddMenuItemInsertionContext = useSetAtomState(
    addMenuItemInsertionContextState,
  );
  const setSelectedNavigationMenuItemInEditMode = useSetAtomState(
    selectedNavigationMenuItemInEditModeState,
  );

  const openAddItemToFolderPage = ({
    targetFolderId,
    targetIndex,
    resetNavigationStack = true,
    shouldHighlightDrawerAddMenuItem = true,
  }: OpenAddItemToFolderPageParams) => {
    setAddMenuItemInsertionContext({
      targetFolderId,
      targetIndex,
      shouldHighlightDrawerAddMenuItem,
    });

    const useSubPageFlow =
      sidePanelPage === SidePanelPages.NavigationMenuItemEdit;
    let openedAddItemFlowUsingSubPage = false;

    if (useSubPageFlow) {
      openedAddItemFlowUsingSubPage = pushNewSidebarItemMainMenuSubPage(store);
    }

    if (openedAddItemFlowUsingSubPage) {
      return;
    }

    setSelectedNavigationMenuItemInEditMode(null);
    navigateSidePanel({
      page: SidePanelPages.NavigationMenuAddItem,
      pageTitle: t`New sidebar item`,
      pageIcon: IconColumnInsertRight,
      resetNavigationStack,
    });
  };

  return { openAddItemToFolderPage };
};
