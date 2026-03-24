import { NavigationMenuItemType } from 'twenty-shared/types';
import { isDefined } from 'twenty-shared/utils';

import { type CreateNavigationMenuItemInput } from 'src/engine/metadata-modules/navigation-menu-item/dtos/create-navigation-menu-item.input';
import {
  NavigationMenuItemException,
  NavigationMenuItemExceptionCode,
} from 'src/engine/metadata-modules/navigation-menu-item/navigation-menu-item.exception';

const orderFolderCreateInputs = ({
  folders,
  existingIds,
}: {
  folders: CreateNavigationMenuItemInput[];
  existingIds: Set<string>;
}): CreateNavigationMenuItemInput[] => {
  const result: CreateNavigationMenuItemInput[] = [];
  let remaining = [...folders];

  while (remaining.length > 0) {
    const readyIndex = remaining.findIndex((folder) => {
      if (!isDefined(folder.folderId)) {
        return true;
      }

      if (existingIds.has(folder.folderId)) {
        return true;
      }

      return result.some((readyItem) => readyItem.id === folder.folderId);
    });

    if (readyIndex === -1) {
      throw new NavigationMenuItemException(
        'Invalid folder hierarchy in batch create (missing parent folder or cycle)',
        NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT,
      );
    }

    const [ready] = remaining.splice(readyIndex, 1);

    result.push(ready);
  }

  return result;
};

export const getCreateNavigationMenuItemBatchProcessingIndices = ({
  inputs,
  existingIds,
}: {
  inputs: CreateNavigationMenuItemInput[];
  existingIds: Set<string>;
}): number[] => {
  if (inputs.length === 1) {
    return [0];
  }

  const folderIndices: number[] = [];
  const nonFolderIndices: number[] = [];

  inputs.forEach((input, index) => {
    if (input.type === NavigationMenuItemType.FOLDER) {
      folderIndices.push(index);
    } else {
      nonFolderIndices.push(index);
    }
  });

  const folderInputs = folderIndices.map((index) => inputs[index]);

  for (const folderInput of folderInputs) {
    if (!isDefined(folderInput.id)) {
      throw new NavigationMenuItemException(
        'Folder navigation menu items in a batch create must include an id',
        NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT,
      );
    }
  }

  const orderedFolders = orderFolderCreateInputs({
    folders: folderInputs,
    existingIds,
  });

  const folderInputIdToIndex = new Map<string, number>();

  for (const index of folderIndices) {
    const input = inputs[index];

    if (isDefined(input.id)) {
      folderInputIdToIndex.set(input.id, index);
    }
  }

  const orderedFolderIndices = orderedFolders.map((folderInput) => {
    const index = folderInputIdToIndex.get(folderInput.id!);

    if (!isDefined(index)) {
      throw new NavigationMenuItemException(
        'Failed to resolve folder index in batch create',
        NavigationMenuItemExceptionCode.INVALID_NAVIGATION_MENU_ITEM_INPUT,
      );
    }

    return index;
  });

  return [...orderedFolderIndices, ...nonFolderIndices];
};
