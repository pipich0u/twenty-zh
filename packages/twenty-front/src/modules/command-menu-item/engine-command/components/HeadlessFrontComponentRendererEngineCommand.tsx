import { Suspense, lazy } from 'react';

import { EngineCommandComponentInstanceContext } from '@/command-menu-item/engine-command/states/contexts/EngineCommandComponentInstanceContext';
import { mountedEngineCommandsState } from '@/command-menu-item/engine-command/states/mountedEngineCommandsState';
import { LayoutRenderingProvider } from '@/ui/layout/contexts/LayoutRenderingContext';
import { useAvailableComponentInstanceIdOrThrow } from '@/ui/utilities/state/component-state/hooks/useAvailableComponentInstanceIdOrThrow';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { isDefined } from 'twenty-shared/utils';
import { PageLayoutType } from '~/generated-metadata/graphql';

const FrontComponentRenderer = lazy(() =>
  import('@/front-components/components/FrontComponentRenderer').then(
    (module) => ({ default: module.FrontComponentRenderer }),
  ),
);

export const HeadlessFrontComponentRendererEngineCommand = () => {
  const engineCommandId = useAvailableComponentInstanceIdOrThrow(
    EngineCommandComponentInstanceContext,
  );

  const mountedEngineCommands = useAtomStateValue(mountedEngineCommandsState);
  const mountContext = mountedEngineCommands.get(engineCommandId);

  if (!isDefined(mountContext?.frontComponentId)) {
    return null;
  }

  const objectNameSingular = mountContext.objectMetadataItem?.nameSingular;

  const recordId =
    mountContext.selectedRecords.length === 1
      ? mountContext.selectedRecords[0].id
      : undefined;

  return (
    <Suspense fallback={null}>
      <LayoutRenderingProvider
        value={{
          targetRecordIdentifier:
            isDefined(objectNameSingular) && isDefined(recordId)
              ? {
                  id: recordId,
                  targetObjectNameSingular: objectNameSingular,
                }
              : undefined,
          layoutType: PageLayoutType.DASHBOARD,
          isInSidePanel: false,
        }}
      >
        <FrontComponentRenderer
          frontComponentId={mountContext.frontComponentId}
          commandMenuItemId={engineCommandId}
        />
      </LayoutRenderingProvider>
    </Suspense>
  );
};
