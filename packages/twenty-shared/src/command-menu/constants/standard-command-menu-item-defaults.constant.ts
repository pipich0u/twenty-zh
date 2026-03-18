// Editable defaults for standard command menu items, extracted from
// STANDARD_COMMAND_MENU_ITEMS on the server. Shared between front and back
// so that "Reset pinned commands" and "Reset label to default" can restore
// items to their original seeded values.
export const STANDARD_COMMAND_MENU_ITEM_DEFAULTS: Record<
  string,
  { isPinned: boolean; position: number; shortLabel: string | null }
> = {
  NAVIGATE_TO_NEXT_RECORD: { isPinned: true, position: 0, shortLabel: null },
  NAVIGATE_TO_PREVIOUS_RECORD: {
    isPinned: true,
    position: 1,
    shortLabel: null,
  },
  CREATE_NEW_RECORD: { isPinned: true, position: 2, shortLabel: 'New record' },
  DELETE_SINGLE_RECORD: { isPinned: false, position: 3, shortLabel: 'Delete' },
  DELETE_MULTIPLE_RECORDS: {
    isPinned: false,
    position: 4,
    shortLabel: 'Delete',
  },
  RESTORE_SINGLE_RECORD: {
    isPinned: true,
    position: 5,
    shortLabel: 'Restore',
  },
  RESTORE_MULTIPLE_RECORDS: {
    isPinned: true,
    position: 6,
    shortLabel: 'Restore',
  },
  DESTROY_SINGLE_RECORD: {
    isPinned: false,
    position: 7,
    shortLabel: 'Destroy',
  },
  DESTROY_MULTIPLE_RECORDS: {
    isPinned: false,
    position: 8,
    shortLabel: 'Destroy',
  },
  ADD_TO_FAVORITES: { isPinned: true, position: 9, shortLabel: null },
  REMOVE_FROM_FAVORITES: { isPinned: true, position: 10, shortLabel: null },
  EXPORT_NOTE_TO_PDF: { isPinned: false, position: 11, shortLabel: 'Export' },
  EXPORT_FROM_RECORD_INDEX: {
    isPinned: false,
    position: 12,
    shortLabel: 'Export',
  },
  EXPORT_FROM_RECORD_SHOW: {
    isPinned: false,
    position: 13,
    shortLabel: 'Export',
  },
  UPDATE_MULTIPLE_RECORDS: {
    isPinned: true,
    position: 14,
    shortLabel: 'Update',
  },
  MERGE_MULTIPLE_RECORDS: {
    isPinned: false,
    position: 15,
    shortLabel: 'Merge',
  },
  EXPORT_MULTIPLE_RECORDS: {
    isPinned: false,
    position: 16,
    shortLabel: 'Export',
  },
  IMPORT_RECORDS: { isPinned: false, position: 17, shortLabel: 'Import' },
  EXPORT_VIEW: { isPinned: false, position: 18, shortLabel: 'Export' },
  SEE_DELETED_RECORDS: {
    isPinned: false,
    position: 19,
    shortLabel: 'Deleted records',
  },
  CREATE_NEW_VIEW: {
    isPinned: false,
    position: 20,
    shortLabel: 'Create View',
  },
  HIDE_DELETED_RECORDS: {
    isPinned: false,
    position: 21,
    shortLabel: 'Hide deleted',
  },
  GO_TO_PEOPLE: { isPinned: false, position: 23, shortLabel: 'People' },
  GO_TO_COMPANIES: { isPinned: false, position: 24, shortLabel: 'Companies' },
  GO_TO_DASHBOARDS: {
    isPinned: false,
    position: 25,
    shortLabel: 'Dashboards',
  },
  GO_TO_OPPORTUNITIES: {
    isPinned: false,
    position: 26,
    shortLabel: 'Opportunities',
  },
  GO_TO_SETTINGS: { isPinned: false, position: 27, shortLabel: 'Settings' },
  GO_TO_TASKS: { isPinned: false, position: 28, shortLabel: 'Tasks' },
  GO_TO_NOTES: { isPinned: false, position: 29, shortLabel: 'Notes' },
  EDIT_RECORD_PAGE_LAYOUT: {
    isPinned: false,
    position: 30,
    shortLabel: 'Edit Layout',
  },
  EDIT_DASHBOARD_LAYOUT: {
    isPinned: true,
    position: 33,
    shortLabel: 'Edit',
  },
  SAVE_DASHBOARD_LAYOUT: {
    isPinned: true,
    position: 34,
    shortLabel: 'Save',
  },
  CANCEL_DASHBOARD_LAYOUT: {
    isPinned: true,
    position: 35,
    shortLabel: 'Cancel',
  },
  DUPLICATE_DASHBOARD: {
    isPinned: false,
    position: 36,
    shortLabel: 'Duplicate',
  },
  GO_TO_WORKFLOWS: {
    isPinned: false,
    position: 41,
    shortLabel: 'Workflows',
  },
  ACTIVATE_WORKFLOW: {
    isPinned: true,
    position: 42,
    shortLabel: 'Activate',
  },
  DEACTIVATE_WORKFLOW: {
    isPinned: true,
    position: 43,
    shortLabel: 'Deactivate',
  },
  DISCARD_DRAFT_WORKFLOW: {
    isPinned: true,
    position: 44,
    shortLabel: 'Discard Draft',
  },
  TEST_WORKFLOW: { isPinned: true, position: 45, shortLabel: 'Test' },
  SEE_ACTIVE_VERSION_WORKFLOW: {
    isPinned: false,
    position: 46,
    shortLabel: 'See active version',
  },
  SEE_RUNS_WORKFLOW: {
    isPinned: true,
    position: 47,
    shortLabel: 'See runs',
  },
  SEE_VERSIONS_WORKFLOW: {
    isPinned: false,
    position: 48,
    shortLabel: 'See versions',
  },
  ADD_NODE_WORKFLOW: {
    isPinned: true,
    position: 49,
    shortLabel: 'Add a node',
  },
  TIDY_UP_WORKFLOW: {
    isPinned: false,
    position: 50,
    shortLabel: 'Tidy up',
  },
  DUPLICATE_WORKFLOW: {
    isPinned: false,
    position: 51,
    shortLabel: 'Duplicate',
  },
  GO_TO_RUNS: { isPinned: false, position: 52, shortLabel: 'See runs' },
  SEE_VERSION_WORKFLOW_RUN: {
    isPinned: true,
    position: 53,
    shortLabel: 'See version',
  },
  SEE_WORKFLOW_WORKFLOW_RUN: {
    isPinned: true,
    position: 54,
    shortLabel: 'See workflow',
  },
  STOP_WORKFLOW_RUN: { isPinned: true, position: 55, shortLabel: 'Stop' },
  SEE_RUNS_WORKFLOW_VERSION: {
    isPinned: true,
    position: 56,
    shortLabel: 'See runs',
  },
  SEE_WORKFLOW_WORKFLOW_VERSION: {
    isPinned: true,
    position: 57,
    shortLabel: 'See workflow',
  },
  USE_AS_DRAFT_WORKFLOW_VERSION: {
    isPinned: true,
    position: 58,
    shortLabel: 'Use as draft',
  },
  SEE_VERSIONS_WORKFLOW_VERSION: {
    isPinned: false,
    position: 59,
    shortLabel: 'See versions',
  },
  SEARCH_RECORDS: { isPinned: false, position: 60, shortLabel: 'Search' },
  SEARCH_RECORDS_FALLBACK: {
    isPinned: false,
    position: 61,
    shortLabel: 'Search',
  },
  ASK_AI: { isPinned: false, position: 62, shortLabel: 'Ask AI' },
  VIEW_PREVIOUS_AI_CHATS: {
    isPinned: false,
    position: 63,
    shortLabel: 'Previous AI Chats',
  },
};
