import { useLingui } from '@lingui/react/macro';
import { isNonEmptyString } from '@sniptt/guards';
import { useStore } from 'jotai';
import { SidePanelPages } from 'twenty-shared/types';
import { IconColumnInsertRight } from 'twenty-ui/display';
import { v4 } from 'uuid';

import { addMenuItemInsertionContextState } from '@/navigation-menu-item/common/states/addMenuItemInsertionContextState';
import { selectedNavigationMenuItemInEditModeState } from '@/navigation-menu-item/common/states/selectedNavigationMenuItemInEditModeState';
import { useNavigateSidePanel } from '@/side-panel/hooks/useNavigateSidePanel';
import { sidePanelPageInfoState } from '@/side-panel/states/sidePanelPageInfoState';
import { sidePanelPageState } from '@/side-panel/states/sidePanelPageState';
import { sidePanelSubPageStackComponentState } from '@/side-panel/states/sidePanelSubPageStackComponentState';
import { SidePanelSubPages } from '@/side-panel/types/SidePanelSubPages';
import { getSidePanelSubPageTitle } from '@/side-panel/utils/getSidePanelSubPageTitle';
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

  const pushNewSidebarItemMainMenuSubPage = () => {
    const pageInfo = store.get(sidePanelPageInfoState.atom);

    if (!isNonEmptyString(pageInfo.instanceId)) {
      return false;
    }

    const subPage = SidePanelSubPages.NewSidebarItemMainMenu;
    const stackAtom = sidePanelSubPageStackComponentState.atomFamily({
      instanceId: pageInfo.instanceId,
    });
    const currentStack = store.get(stackAtom);

    store.set(stackAtom, [
      ...currentStack,
      {
        id: v4(),
        subPage,
        title: getSidePanelSubPageTitle(subPage),
      },
    ]);

    return true;
  };

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
      openedAddItemFlowUsingSubPage = pushNewSidebarItemMainMenuSubPage();
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
