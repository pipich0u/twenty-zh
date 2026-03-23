import { createAtomFamilyState } from '@/ui/utilities/state/jotai/utils/createAtomFamilyState';

export type WorkflowRunCall = {
  workflowId: string;
  workflowVersionId: string;
  payload?: Record<string, any>;
};

export const workflowRunCallsFamilyState = createAtomFamilyState<
  WorkflowRunCall[],
  string
>({
  key: 'workflowRunCallsFamilyState',
  defaultValue: [],
});
