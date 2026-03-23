import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';

export const useCommandMenuFeatureFlags = (): Record<string, boolean> => {
  const currentWorkspace = useAtomStateValue(currentWorkspaceState);

  const featureFlags: Record<string, boolean> = {};

  for (const featureFlag of currentWorkspace?.featureFlags ?? []) {
    featureFlags[featureFlag.key] = featureFlag.value === true;
  }

  return featureFlags;
};
