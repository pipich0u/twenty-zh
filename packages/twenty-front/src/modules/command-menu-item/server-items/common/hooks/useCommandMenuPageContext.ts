import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { contextStoreCurrentViewTypeComponentState } from '@/context-store/states/contextStoreCurrentViewTypeComponentState';
import { contextStoreIsPageInEditModeComponentState } from '@/context-store/states/contextStoreIsPageInEditModeComponentState';
import { ContextStoreViewType } from '@/context-store/types/ContextStoreViewType';
import { useObjectMetadataItems } from '@/object-metadata/hooks/useObjectMetadataItems';
import { hasAnySoftDeleteFilterOnViewComponentSelector } from '@/object-record/record-filter/states/hasAnySoftDeleteFilterOnView';
import { getRecordIndexIdFromObjectNamePluralAndViewId } from '@/object-record/utils/getRecordIndexIdFromObjectNamePluralAndViewId';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { CommandMenuContextApiPageType } from 'twenty-shared/types';

type CommandMenuPageContext = {
  pageType: CommandMenuContextApiPageType;
  isPageInEditMode: boolean;
  hasAnySoftDeleteFilterOnView: boolean;
};

export const useCommandMenuPageContext = ({
  contextStoreInstanceId,
}: {
  contextStoreInstanceId?: string;
} = {}): CommandMenuPageContext => {
  const contextStoreCurrentObjectMetadataItemId = useAtomComponentStateValue(
    contextStoreCurrentObjectMetadataItemIdComponentState,
    contextStoreInstanceId,
  );

  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
    contextStoreInstanceId,
  );

  const { objectMetadataItems } = useObjectMetadataItems();
  const objectMetadataItem = objectMetadataItems.find(
    (item) => item.id === contextStoreCurrentObjectMetadataItemId,
  );

  const recordIndexId = getRecordIndexIdFromObjectNamePluralAndViewId(
    objectMetadataItem?.namePlural ?? '',
    contextStoreCurrentViewId ?? '',
  );

  const contextStoreCurrentViewType = useAtomComponentStateValue(
    contextStoreCurrentViewTypeComponentState,
    contextStoreInstanceId,
  );

  const contextStoreIsPageInEditMode = useAtomComponentStateValue(
    contextStoreIsPageInEditModeComponentState,
    contextStoreInstanceId,
  );

  const hasAnySoftDeleteFilterOnView = useAtomComponentSelectorValue(
    hasAnySoftDeleteFilterOnViewComponentSelector,
    recordIndexId,
  );

  const pageType =
    contextStoreCurrentViewType === ContextStoreViewType.ShowPage
      ? CommandMenuContextApiPageType.RECORD_PAGE
      : CommandMenuContextApiPageType.INDEX_PAGE;

  return {
    pageType,
    isPageInEditMode: contextStoreIsPageInEditMode,
    hasAnySoftDeleteFilterOnView,
  };
};
