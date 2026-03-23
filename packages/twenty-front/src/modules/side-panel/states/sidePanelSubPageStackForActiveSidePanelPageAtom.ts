import { atom } from 'jotai';
import { isNonEmptyString } from '@sniptt/guards';

import { sidePanelPageInfoState } from '@/side-panel/states/sidePanelPageInfoState';
import { sidePanelSubPageStackComponentState } from '@/side-panel/states/sidePanelSubPageStackComponentState';

export const sidePanelSubPageStackForActiveSidePanelPageAtom = atom((get) => {
  const pageInfo = get(sidePanelPageInfoState.atom);

  if (!isNonEmptyString(pageInfo.instanceId)) {
    return [];
  }

  return get(
    sidePanelSubPageStackComponentState.atomFamily({
      instanceId: pageInfo.instanceId,
    }),
  );
});
