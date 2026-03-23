import { FIND_COMMAND_MENU_ITEM_DEFAULT_VALUES } from '@/command-menu-item/graphql/queries/findCommandMenuItemDefaultValues';
import { commandMenuItemsDraftState } from '@/command-menu-item/server-items/edit/states/commandMenuItemsDraftState';
import { useQuery } from '@apollo/client/react';
import { useStore } from 'jotai';
import { useCallback, useMemo } from 'react';
import { isDefined } from 'twenty-shared/utils';
import {
  type FindCommandMenuItemDefaultValuesQuery,
  type FindCommandMenuItemDefaultValuesQueryVariables,
} from '~/generated-metadata/graphql';

type UseResetCommandMenuItemsDraftParams = {
  commandMenuItemIds: string[];
};

export const useResetCommandMenuItemsDraft = ({
  commandMenuItemIds,
}: UseResetCommandMenuItemsDraftParams) => {
  const store = useStore();

  const { data, loading: isLoadingCommandMenuItemDefaultValues } = useQuery<
    FindCommandMenuItemDefaultValuesQuery,
    FindCommandMenuItemDefaultValuesQueryVariables
  >(FIND_COMMAND_MENU_ITEM_DEFAULT_VALUES, {
    variables: { ids: commandMenuItemIds },
    skip: commandMenuItemIds.length === 0,
    fetchPolicy: 'cache-first',
  });

  const commandMenuItemDefaultValuesById = useMemo(
    () =>
      new Map(
        (data?.commandMenuItemDefaultValues ?? []).map((defaultValues) => [
          defaultValues.id,
          defaultValues,
        ]),
      ),
    [data?.commandMenuItemDefaultValues],
  );

  const resetCommandMenuItemsDraft = useCallback(() => {
    const draft = store.get(commandMenuItemsDraftState.atom);

    if (!isDefined(draft)) {
      return;
    }

    const resetDraft = draft.map((item) => {
      const defaultValues = commandMenuItemDefaultValuesById.get(item.id);

      if (!isDefined(defaultValues)) {
        return item;
      }

      return {
        ...item,
        isPinned: defaultValues.isPinned,
        position: defaultValues.position,
        shortLabel: defaultValues.shortLabel,
      };
    });

    store.set(commandMenuItemsDraftState.atom, resetDraft);
  }, [commandMenuItemDefaultValuesById, store]);

  return {
    commandMenuItemDefaultValuesById,
    isLoadingCommandMenuItemDefaultValues,
    resetCommandMenuItemsDraft,
  };
};
