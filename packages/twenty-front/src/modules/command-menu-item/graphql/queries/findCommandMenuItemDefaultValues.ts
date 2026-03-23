import { gql } from '@apollo/client';

export const FIND_COMMAND_MENU_ITEM_DEFAULT_VALUES = gql`
  query FindCommandMenuItemDefaultValues($ids: [UUID!]!) {
    commandMenuItemDefaultValues(ids: $ids) {
      id
      label
      shortLabel
      isPinned
      position
    }
  }
`;
