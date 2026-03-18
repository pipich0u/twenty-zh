import { useApolloClient } from '@apollo/client/react';

import { commandMenuItemsDraftState } from '@/command-menu-item/edit/states/commandMenuItemsDraftState';
import { activeCustomizationPageLayoutIdsState } from '@/layout-customization/states/activeCustomizationPageLayoutIdsState';
import { isLayoutCustomizationModeEnabledState } from '@/layout-customization/states/isLayoutCustomizationModeEnabledState';
import { filterWorkspaceNavigationMenuItems } from '@/navigation-menu-item/common/utils/filterWorkspaceNavigationMenuItems';
import { navigationMenuItemsDraftState } from '@/navigation-menu-item/common/states/navigationMenuItemsDraftState';
import { navigationMenuItemsSelector } from '@/navigation-menu-item/common/states/navigationMenuItemsSelector';
import { useStore } from 'jotai';
import { useCallback } from 'react';
import { FindManyCommandMenuItemsDocument } from '~/generated-metadata/graphql';

export const useEnterLayoutCustomizationMode = () => {
  const store = useStore();
  const apolloClient = useApolloClient();

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

    const commandMenuItemsCache = apolloClient.readQuery({
      query: FindManyCommandMenuItemsDocument,
    });
    if (commandMenuItemsCache?.commandMenuItems) {
      store.set(
        commandMenuItemsDraftState.atom,
        commandMenuItemsCache.commandMenuItems,
      );
    }

    store.set(activeCustomizationPageLayoutIdsState.atom, []);

    store.set(isLayoutCustomizationModeEnabledState.atom, true);
  }, [store, apolloClient]);

  return { enterLayoutCustomizationMode };
};
