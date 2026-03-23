import { CommandMenuContext } from '@/command-menu-item/contexts/CommandMenuContext';
import { useContext } from 'react';

export const useCommandMenuContextStoreInstanceId = () =>
  useContext(CommandMenuContext).contextStoreInstanceId;
