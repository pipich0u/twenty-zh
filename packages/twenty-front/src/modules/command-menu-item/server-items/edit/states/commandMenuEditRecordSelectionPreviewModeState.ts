import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';

export type CommandMenuEditRecordSelectionPreviewMode =
  | 'auto'
  | 'none'
  | 'single'
  | 'multiple';

export const commandMenuEditRecordSelectionPreviewModeState =
  createAtomComponentState<CommandMenuEditRecordSelectionPreviewMode>({
    key: 'commandMenuEditRecordSelectionPreviewModeState',
    defaultValue: 'auto',
    componentInstanceContext: ContextStoreComponentInstanceContext,
  });
