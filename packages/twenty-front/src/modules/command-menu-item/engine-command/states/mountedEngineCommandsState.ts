import { type MountedCommandState } from '@/command-menu-item/engine-command/types/MountedCommandContext';
import { createAtomState } from '@/ui/utilities/state/jotai/utils/createAtomState';

export const mountedEngineCommandsState = createAtomState<
  Map<string, MountedCommandState>
>({
  key: 'mountedEngineCommandsState',
  defaultValue: new Map(),
});
