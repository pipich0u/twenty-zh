import { useCallback } from 'react';
import { useStore } from 'jotai';
import { useApolloClient, useMutation, useQuery } from '@apollo/client/react';
import { isDefined } from 'twenty-shared/utils';

import { commandMenuItemsDraftState } from '@/command-menu-item/edit/states/commandMenuItemsDraftState';
import { UPDATE_COMMAND_MENU_ITEM } from '@/command-menu-item/graphql/mutations/updateCommandMenuItem';
import {
  FindManyCommandMenuItemsDocument,
  type UpdateCommandMenuItemInput,
} from '~/generated-metadata/graphql';

export const useSaveCommandMenuItemsDraft = () => {
  const store = useStore();
  const apolloClient = useApolloClient();
  const [updateCommandMenuItem] = useMutation(UPDATE_COMMAND_MENU_ITEM);

  const { data } = useQuery(FindManyCommandMenuItemsDocument);

  const saveCommandMenuItemsDraft = useCallback(async () => {
    const draft = store.get(commandMenuItemsDraftState.atom);

    if (!isDefined(draft)) {
      return;
    }

    const serverItems = data?.commandMenuItems ?? [];

    const serverItemsById = new Map(
      serverItems.map((item) => [item.id, item]),
    );

    const changedItems = draft.filter((draftItem) => {
      const serverItem = serverItemsById.get(draftItem.id);

      if (!isDefined(serverItem)) {
        return false;
      }

      return (
        draftItem.isPinned !== serverItem.isPinned ||
        draftItem.position !== serverItem.position
      );
    });

    for (const item of changedItems) {
      const input: UpdateCommandMenuItemInput = {
        id: item.id,
        isPinned: item.isPinned,
        position: item.position,
      };

      await updateCommandMenuItem({
        variables: { input },
      });
    }

    if (changedItems.length > 0) {
      await apolloClient.refetchQueries({
        include: [FindManyCommandMenuItemsDocument],
      });
    }
  }, [store, data, updateCommandMenuItem, apolloClient]);

  return { saveCommandMenuItemsDraft };
};
