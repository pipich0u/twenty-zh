import { type CommandMenuItemEditableFields } from '@/command-menu-item/edit/types/CommandMenuItemEditableFields';
import { EngineComponentKey } from '~/generated-metadata/graphql';

// Standard defaults for isPinned and position, extracted from
// STANDARD_COMMAND_MENU_ITEMS on the server. Used by the "Reset pinned
// commands" action to restore draft items to their original values.
export const STANDARD_COMMAND_MENU_ITEM_DEFAULTS: Partial<
  Record<EngineComponentKey, CommandMenuItemEditableFields>
> = {
  [EngineComponentKey.NAVIGATE_TO_NEXT_RECORD]: { isPinned: true, position: 0 },
  [EngineComponentKey.NAVIGATE_TO_PREVIOUS_RECORD]: {
    isPinned: true,
    position: 1,
  },
  [EngineComponentKey.CREATE_NEW_RECORD]: { isPinned: true, position: 2 },
  [EngineComponentKey.DELETE_SINGLE_RECORD]: { isPinned: false, position: 3 },
  [EngineComponentKey.DELETE_MULTIPLE_RECORDS]: { isPinned: false, position: 4 },
  [EngineComponentKey.RESTORE_SINGLE_RECORD]: { isPinned: true, position: 5 },
  [EngineComponentKey.RESTORE_MULTIPLE_RECORDS]: {
    isPinned: true,
    position: 6,
  },
  [EngineComponentKey.DESTROY_SINGLE_RECORD]: { isPinned: false, position: 7 },
  [EngineComponentKey.DESTROY_MULTIPLE_RECORDS]: {
    isPinned: false,
    position: 8,
  },
  [EngineComponentKey.ADD_TO_FAVORITES]: { isPinned: true, position: 9 },
  [EngineComponentKey.REMOVE_FROM_FAVORITES]: { isPinned: true, position: 10 },
  [EngineComponentKey.EXPORT_NOTE_TO_PDF]: { isPinned: false, position: 11 },
  [EngineComponentKey.EXPORT_FROM_RECORD_INDEX]: {
    isPinned: false,
    position: 12,
  },
  [EngineComponentKey.EXPORT_FROM_RECORD_SHOW]: {
    isPinned: false,
    position: 13,
  },
  [EngineComponentKey.UPDATE_MULTIPLE_RECORDS]: {
    isPinned: true,
    position: 14,
  },
  [EngineComponentKey.MERGE_MULTIPLE_RECORDS]: {
    isPinned: false,
    position: 15,
  },
  [EngineComponentKey.EXPORT_MULTIPLE_RECORDS]: {
    isPinned: false,
    position: 16,
  },
  [EngineComponentKey.IMPORT_RECORDS]: { isPinned: false, position: 17 },
  [EngineComponentKey.EXPORT_VIEW]: { isPinned: false, position: 18 },
  [EngineComponentKey.SEE_DELETED_RECORDS]: { isPinned: false, position: 19 },
  [EngineComponentKey.CREATE_NEW_VIEW]: { isPinned: false, position: 20 },
  [EngineComponentKey.HIDE_DELETED_RECORDS]: { isPinned: false, position: 21 },
  [EngineComponentKey.GO_TO_PEOPLE]: { isPinned: false, position: 23 },
  [EngineComponentKey.GO_TO_COMPANIES]: { isPinned: false, position: 24 },
  [EngineComponentKey.GO_TO_DASHBOARDS]: { isPinned: false, position: 25 },
  [EngineComponentKey.GO_TO_OPPORTUNITIES]: { isPinned: false, position: 26 },
  [EngineComponentKey.GO_TO_SETTINGS]: { isPinned: false, position: 27 },
  [EngineComponentKey.GO_TO_TASKS]: { isPinned: false, position: 28 },
  [EngineComponentKey.GO_TO_NOTES]: { isPinned: false, position: 29 },
  [EngineComponentKey.EDIT_RECORD_PAGE_LAYOUT]: {
    isPinned: false,
    position: 30,
  },
  [EngineComponentKey.EDIT_DASHBOARD_LAYOUT]: { isPinned: true, position: 33 },
  [EngineComponentKey.SAVE_DASHBOARD_LAYOUT]: { isPinned: true, position: 34 },
  [EngineComponentKey.CANCEL_DASHBOARD_LAYOUT]: {
    isPinned: true,
    position: 35,
  },
  [EngineComponentKey.DUPLICATE_DASHBOARD]: { isPinned: false, position: 36 },
  [EngineComponentKey.GO_TO_WORKFLOWS]: { isPinned: false, position: 41 },
  [EngineComponentKey.ACTIVATE_WORKFLOW]: { isPinned: true, position: 42 },
  [EngineComponentKey.DEACTIVATE_WORKFLOW]: { isPinned: true, position: 43 },
  [EngineComponentKey.DISCARD_DRAFT_WORKFLOW]: { isPinned: true, position: 44 },
  [EngineComponentKey.TEST_WORKFLOW]: { isPinned: true, position: 45 },
  [EngineComponentKey.SEARCH_RECORDS]: { isPinned: false, position: 60 },
  [EngineComponentKey.SEARCH_RECORDS_FALLBACK]: {
    isPinned: false,
    position: 61,
  },
  [EngineComponentKey.ASK_AI]: { isPinned: false, position: 62 },
  [EngineComponentKey.VIEW_PREVIOUS_AI_CHATS]: {
    isPinned: false,
    position: 63,
  },
};
