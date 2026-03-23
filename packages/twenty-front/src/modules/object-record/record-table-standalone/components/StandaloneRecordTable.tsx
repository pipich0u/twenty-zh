import { useRecordIndexContextOrThrow } from '@/object-record/record-index/contexts/RecordIndexContext';
import { StandaloneRecordTableSetReadOnlyColumnHeadersEffect } from '@/object-record/record-table-standalone/components/StandaloneRecordTableSetReadOnlyColumnHeadersEffect';
import { RecordTableWithWrappers } from '@/object-record/record-table/components/RecordTableWithWrappers';

export const StandaloneRecordTable = () => {
  const { objectNameSingular, recordIndexId, viewBarInstanceId } =
    useRecordIndexContextOrThrow();

  return (
    <>
      <StandaloneRecordTableSetReadOnlyColumnHeadersEffect
        recordTableId={recordIndexId}
      />
      <RecordTableWithWrappers
        recordTableId={recordIndexId}
        objectNameSingular={objectNameSingular}
        viewBarId={viewBarInstanceId}
      />
    </>
  );
};
