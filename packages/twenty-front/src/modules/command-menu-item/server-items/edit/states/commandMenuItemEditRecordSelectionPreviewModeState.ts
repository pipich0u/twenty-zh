import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';

export type CommandMenuItemEditRecordSelectionPreviewMode =
  | 'auto'
  | 'none'
  | 'single'
  | 'multiple';

export const commandMenuItemEditRecordSelectionPreviewModeState =
  createAtomComponentState<CommandMenuItemEditRecordSelectionPreviewMode>({
    key: 'commandMenuItemEditRecordSelectionPreviewModeState',
    defaultValue: 'auto',
    componentInstanceContext: ContextStoreComponentInstanceContext,
  });
