import { useCallback } from 'react';
import { useStore } from 'jotai';
import { isDefined } from 'twenty-shared/utils';

import { commandMenuItemsDraftState } from '@/command-menu-item/edit/states/commandMenuItemsDraftState';
import { STANDARD_COMMAND_MENU_ITEM_DEFAULTS } from '@/command-menu-item/edit/constants/standardCommandMenuItemDefaults';
import { type EngineComponentKey } from '~/generated-metadata/graphql';

export const useResetCommandMenuItemsDraft = () => {
  const store = useStore();

  const resetCommandMenuItemsDraft = useCallback(() => {
    const draft = store.get(commandMenuItemsDraftState.atom);

    if (!isDefined(draft)) {
      return;
    }

    const resetDraft = draft.map((item) => {
      if (!isDefined(item.engineComponentKey)) {
        return item;
      }

      const defaults =
        STANDARD_COMMAND_MENU_ITEM_DEFAULTS[
          item.engineComponentKey as EngineComponentKey
        ];

      if (!isDefined(defaults)) {
        return item;
      }

      return {
        ...item,
        isPinned: defaults.isPinned,
        position: defaults.position,
      };
    });

    store.set(commandMenuItemsDraftState.atom, resetDraft);
  }, [store]);

  return { resetCommandMenuItemsDraft };
};
