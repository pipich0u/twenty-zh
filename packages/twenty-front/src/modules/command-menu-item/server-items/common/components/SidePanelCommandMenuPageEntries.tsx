import { CommandMenuContextProvider } from '@/command-menu-item/contexts/CommandMenuContextProvider';
import { SidePanelCommandMenuItemEditPage } from '@/command-menu-item/server-items/edit/components/SidePanelCommandMenuItemEditPage';
import { SidePanelCommandMenuItemDisplayPage } from '@/command-menu-item/server-items/display/components/SidePanelCommandMenuItemDisplayPage';
import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { SidePanelRootPage } from '@/side-panel/pages/root/components/SidePanelRootPage';
import { useIsFeatureEnabled } from '@/workspace/hooks/useIsFeatureEnabled';
import { FeatureFlagKey } from '~/generated-metadata/graphql';

const SidePanelCommandMenuPageWithMainContext = ({
  children,
}: {
  children: React.ReactNode;
}) => (
  <CommandMenuContextProvider
    isInSidePanel={true}
    displayType="listItem"
    containerType="command-menu-list"
    contextStoreInstanceId={MAIN_CONTEXT_STORE_INSTANCE_ID}
  >
    {children}
  </CommandMenuContextProvider>
);

export const SidePanelCommandMenuDisplayPageEntry = () => {
  const isCommandMenuItemEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED,
  );

  if (!isCommandMenuItemEnabled) {
    return <SidePanelRootPage />;
  }

  return (
    <SidePanelCommandMenuPageWithMainContext>
      <SidePanelCommandMenuItemDisplayPage />
    </SidePanelCommandMenuPageWithMainContext>
  );
};

export const SidePanelCommandMenuEditPageEntry = () => {
  const isCommandMenuItemEnabled = useIsFeatureEnabled(
    FeatureFlagKey.IS_COMMAND_MENU_ITEM_ENABLED,
  );

  if (!isCommandMenuItemEnabled) {
    return <SidePanelRootPage />;
  }

  return (
    <SidePanelCommandMenuPageWithMainContext>
      <SidePanelCommandMenuItemEditPage />
    </SidePanelCommandMenuPageWithMainContext>
  );
};
