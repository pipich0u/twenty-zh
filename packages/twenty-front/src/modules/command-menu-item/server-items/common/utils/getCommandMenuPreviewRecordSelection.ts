import { type ContextStoreTargetedRecordsRule } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { type CommandMenuItemEditRecordSelectionPreviewMode } from '@/command-menu-item/server-items/edit/states/commandMenuItemEditRecordSelectionPreviewModeState';

type CommandMenuPreviewRecordSelection = {
  contextStorePreviewTargetedRecordsRule: ContextStoreTargetedRecordsRule;
  contextStorePreviewNumberOfSelectedRecords: number;
};

const COMMAND_MENU_PREVIEW_RECORD_COUNT_BY_MODE: Record<
  Exclude<CommandMenuItemEditRecordSelectionPreviewMode, 'auto'>,
  number
> = {
  none: 0,
  single: 1,
  multiple: 2,
};

export const getCommandMenuPreviewRecordSelection = ({
  previewMode,
  contextStoreTargetedRecordsRule,
  contextStoreNumberOfSelectedRecords,
  contextStoreRecordIds,
}: {
  previewMode: CommandMenuItemEditRecordSelectionPreviewMode;
  contextStoreTargetedRecordsRule: ContextStoreTargetedRecordsRule;
  contextStoreNumberOfSelectedRecords: number;
  contextStoreRecordIds: string[];
}): CommandMenuPreviewRecordSelection => {
  if (previewMode === 'auto') {
    return {
      contextStorePreviewTargetedRecordsRule: contextStoreTargetedRecordsRule,
      contextStorePreviewNumberOfSelectedRecords:
        contextStoreNumberOfSelectedRecords,
    };
  }

  const previewRecordCount =
    COMMAND_MENU_PREVIEW_RECORD_COUNT_BY_MODE[previewMode];

  return {
    contextStorePreviewTargetedRecordsRule: {
      mode: 'selection',
      selectedRecordIds: contextStoreRecordIds.slice(0, previewRecordCount),
    },
    contextStorePreviewNumberOfSelectedRecords: previewRecordCount,
  };
};
