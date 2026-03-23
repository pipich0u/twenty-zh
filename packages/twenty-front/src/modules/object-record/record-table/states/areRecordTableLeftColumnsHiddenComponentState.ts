import { RecordTableComponentInstanceContext } from '@/object-record/record-table/states/context/RecordTableComponentInstanceContext';
import { createAtomComponentState } from '@/ui/utilities/state/jotai/utils/createAtomComponentState';

export const areRecordTableLeftColumnsHiddenComponentState =
  createAtomComponentState<boolean>({
    key: 'areRecordTableLeftColumnsHiddenComponentState',
    defaultValue: false,
    componentInstanceContext: RecordTableComponentInstanceContext,
  });
