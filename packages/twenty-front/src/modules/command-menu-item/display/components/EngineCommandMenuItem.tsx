import { isEngineCommandMountedFamilySelector } from '@/command-menu-item/engine-command/selectors/isEngineCommandMountedFamilySelector';
import { useMountCommand } from '@/command-menu-item/engine-command/hooks/useMountCommand';
import { ContextStoreComponentInstanceContext } from '@/context-store/states/contexts/ContextStoreComponentInstanceContext';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useAtomFamilySelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomFamilySelectorValue';
import { type EngineComponentKey } from '~/generated-metadata/graphql';

import { HeadlessCommandMenuItem } from './HeadlessCommandMenuItem';

export const EngineCommandMenuItem = ({
  commandMenuItemId,
  engineComponentKey,
  frontComponentId,
}: {
  commandMenuItemId: string;
  engineComponentKey: EngineComponentKey;
  frontComponentId?: string;
}) => {
  const mountCommand = useMountCommand();

  const contextStoreInstanceId = useAvailableComponentInstanceIdOrThrow(
    ContextStoreComponentInstanceContext,
  );

  const isMounted = useAtomFamilySelectorValue(
    isEngineCommandMountedFamilySelector,
    commandMenuItemId,
  );

  const handleClick = () => {
    mountCommand({
      engineCommandId: commandMenuItemId,
      contextStoreInstanceId,
      engineComponentKey,
      frontComponentId,
    });
  };

  return (
    <HeadlessCommandMenuItem
      isMounted={isMounted}
      commandMenuItemId={commandMenuItemId}
      onClick={handleClick}
    />
  );
};
