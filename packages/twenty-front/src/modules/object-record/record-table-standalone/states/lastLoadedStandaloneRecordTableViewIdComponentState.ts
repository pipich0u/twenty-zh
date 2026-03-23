import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';

export const lastLoadedStandaloneRecordTableViewIdComponentState =
  createAtomComponentState<string | null>({
    key: 'lastLoadedStandaloneRecordTableViewIdComponentState',
    defaultValue: null,
    componentInstanceContext: ContextStoreComponentInstanceContext,
  });
