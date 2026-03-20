import { type ContextStoreTargetedRecordsRule } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { type CommandMenuItemEditRecordSelectionPreviewMode } from '@/command-menu-item/server-items/edit/states/commandMenuItemEditRecordSelectionPreviewModeState';

type PreviewContextStoreState = {
  targetedRecordsRule: ContextStoreTargetedRecordsRule;
  numberOfSelectedRecords: number;
};

const PREVIEW_RECORD_COUNTS: Record<
  Exclude<CommandMenuItemEditRecordSelectionPreviewMode, 'auto'>,
  number
> = {
  none: 0,
  single: 1,
  multiple: 2,
};

export const getPreviewContextStoreState = (
  previewMode: CommandMenuItemEditRecordSelectionPreviewMode,
  mainTargetedRecordsRule: ContextStoreTargetedRecordsRule,
  mainNumberOfSelectedRecords: number,
  mainRecordIds: string[],
): PreviewContextStoreState => {
  if (previewMode === 'auto') {
    return {
      targetedRecordsRule: mainTargetedRecordsRule,
      numberOfSelectedRecords: mainNumberOfSelectedRecords,
    };
  }

  const count = PREVIEW_RECORD_COUNTS[previewMode];

  return {
    targetedRecordsRule: {
      mode: 'selection',
      selectedRecordIds: mainRecordIds.slice(0, count),
    },
    numberOfSelectedRecords: count,
  };
};
