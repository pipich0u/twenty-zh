import { useRecordTableContextOrThrow } from '@/object-record/record-table/contexts/RecordTableContext';
import { areRecordTableLeftColumnsHiddenComponentState } from '@/object-record/record-table/states/areRecordTableLeftColumnsHiddenComponentState';
import { recordTableWidthComponentState } from '@/object-record/record-table/states/recordTableWidthComponentState';
import { shouldCompactRecordTableFirstColumnComponentState } from '@/object-record/record-table/states/shouldCompactRecordTableFirstColumnComponentState';
import { computeLastRecordTableColumnWidth } from '@/object-record/record-table/utils/computeLastRecordTableColumnWidth';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';

export const useRecordTableLastColumnWidthToFill = () => {
  const { visibleRecordFields } = useRecordTableContextOrThrow();

  const recordTableWidth = useAtomComponentStateValue(
    recordTableWidthComponentState,
  );

  const shouldCompactRecordTableFirstColumn = useAtomComponentStateValue(
    shouldCompactRecordTableFirstColumnComponentState,
  );

  const areRecordTableLeftColumnsHidden = useAtomComponentStateValue(
    areRecordTableLeftColumnsHiddenComponentState,
  );

  const { lastColumnWidth } = computeLastRecordTableColumnWidth({
    recordFields: visibleRecordFields,
    tableWidth: recordTableWidth,
    shouldCompactFirstColumn: shouldCompactRecordTableFirstColumn,
    areLeftColumnsHidden: areRecordTableLeftColumnsHidden,
  });

  return {
    lastColumnWidth,
  };
};
