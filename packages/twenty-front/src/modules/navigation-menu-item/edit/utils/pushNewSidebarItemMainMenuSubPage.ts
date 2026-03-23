import { isNonEmptyString } from '@sniptt/guards';
import { type Store } from 'jotai/vanilla/store';
import { isDefined } from 'twenty-shared/utils';
import { v4 } from 'uuid';

import { sidePanelPageInfoState } from '@/side-panel/states/sidePanelPageInfoState';
import { sidePanelSubPageStackComponentState } from '@/side-panel/states/sidePanelSubPageStackComponentState';
import { SidePanelSubPages } from '@/side-panel/types/SidePanelSubPages';
import { getSidePanelSubPageTitle } from '@/side-panel/utils/getSidePanelSubPageTitle';

export const pushNewSidebarItemMainMenuSubPage = (
  store: Store,
  titleOverride?: string,
): boolean => {
  const pageInfo = store.get(sidePanelPageInfoState.atom);

  if (!isNonEmptyString(pageInfo.instanceId)) {
    return false;
  }

  const subPage = SidePanelSubPages.NewSidebarItemMainMenu;
  const title = isDefined(titleOverride)
    ? titleOverride
    : getSidePanelSubPageTitle(subPage);
  const stackAtom = sidePanelSubPageStackComponentState.atomFamily({
    instanceId: pageInfo.instanceId,
  });
  const currentStack = store.get(stackAtom);

  store.set(stackAtom, [
    ...currentStack,
    {
      id: v4(),
      subPage,
      title,
    },
  ]);

  return true;
};
