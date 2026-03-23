import { metadataStoreState } from '@/metadata-store/states/metadataStoreState';
import { type FlatCommandMenuItem } from '@/metadata-store/types/FlatCommandMenuItem';
import { createAtomSelector } from '@/ui/utilities/state/jotai/utils/createAtomSelector';

export const commandMenuItemsSelector = createAtomSelector<
  FlatCommandMenuItem[]
>({
  key: 'commandMenuItemsSelector',
  get: ({ get }) => {
    const storeItem = get(metadataStoreState, 'commandMenuItems');

    return storeItem.current as FlatCommandMenuItem[];
  },
});
