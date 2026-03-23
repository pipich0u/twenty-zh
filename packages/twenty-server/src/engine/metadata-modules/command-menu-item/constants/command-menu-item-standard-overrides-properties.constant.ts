import { type MetadataUniversalFlatEntityPropertiesToCompare } from 'src/engine/workspace-manager/workspace-migration/universal-flat-entity/types/metadata-universal-flat-entity-properties-to-compare.type';

export const COMMAND_MENU_ITEM_STANDARD_OVERRIDES_PROPERTIES = [
  'label',
  'shortLabel',
  'isPinned',
  'position',
] as const satisfies MetadataUniversalFlatEntityPropertiesToCompare<'commandMenuItem'>[];
