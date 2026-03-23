import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export type CommandMenuItemEditRecordSelectionPreviewMode =
  | 'auto'
  | 'none'
  | 'single'
  | 'multiple';

export const commandMenuItemEditRecordSelectionPreviewModeState =
  createAtomState<CommandMenuItemEditRecordSelectionPreviewMode>({
    key: 'commandMenuItemEditRecordSelectionPreviewModeState',
    defaultValue: 'auto',
  });
