import { type NavigationMenuItem } from '~/generated-metadata/graphql';

export type PartitionCreatesAndRecreatesResult = {
  workspaceItems: NavigationMenuItem[];
  workspaceItemsById: Map<string, NavigationMenuItem>;
  currentIds: Set<string>;
  idsToCreate: NavigationMenuItem[];
  idsToRecreate: NavigationMenuItem[];
};
