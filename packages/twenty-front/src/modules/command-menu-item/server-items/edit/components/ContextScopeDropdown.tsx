import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { GenericDropdownContentWidth } from '@/ui/layout/dropdown/constants/GenericDropdownContentWidth';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import {
  IconChevronDown,
  IconSquareCheck,
  IconSquareX,
} from 'twenty-ui/display';
import { MenuItemSelect } from 'twenty-ui/navigation';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const DROPDOWN_ID = 'context-scope-dropdown';

const StyledClickableArea = styled.div`
  align-items: center;
  background-color: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  cursor: pointer;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
  height: 24px;
  padding-left: ${themeCssVariables.spacing[2]};
  padding-right: ${themeCssVariables.spacing[1]};
`;

const StyledLabel = styled.span`
  color: ${themeCssVariables.font.color.primary};
  font-size: ${themeCssVariables.font.size.md};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

export const ContextScopeDropdown = () => {
  const { t } = useLingui();
  const { closeDropdown } = useCloseDropdown();

  const contextStoreTargetedRecordsRule = useAtomComponentStateValue(
    contextStoreTargetedRecordsRuleComponentState,
  );

  const setContextStoreTargetedRecordsRule = useSetAtomComponentState(
    contextStoreTargetedRecordsRuleComponentState,
  );

  const setContextStoreNumberOfSelectedRecords = useSetAtomComponentState(
    contextStoreNumberOfSelectedRecordsComponentState,
  );

  const selectedRecordIds =
    contextStoreTargetedRecordsRule.mode === 'selection'
      ? contextStoreTargetedRecordsRule.selectedRecordIds
      : [];

  const hasRecordSelection =
    selectedRecordIds.length >= 1 ||
    contextStoreTargetedRecordsRule.mode === 'exclusion';

  const handleSelectNoRecord = () => {
    setContextStoreTargetedRecordsRule({
      mode: 'selection',
      selectedRecordIds: [],
    });
    setContextStoreNumberOfSelectedRecords(0);
    closeDropdown(DROPDOWN_ID);
  };

  const handleSelectRecord = () => {
    setContextStoreTargetedRecordsRule({
      mode: 'exclusion',
      excludedRecordIds: [],
    });
    setContextStoreNumberOfSelectedRecords(1);
    closeDropdown(DROPDOWN_ID);
  };

  const TriggerIcon = hasRecordSelection ? IconSquareCheck : IconSquareX;
  const triggerLabel = hasRecordSelection
    ? t`Record(s) selected`
    : t`No record selected`;

  return (
    <Dropdown
      dropdownId={DROPDOWN_ID}
      clickableComponent={
        <StyledClickableArea>
          <TriggerIcon size={16} />
          <StyledLabel>{triggerLabel}</StyledLabel>
          <IconChevronDown size={16} />
        </StyledClickableArea>
      }
      dropdownPlacement="bottom-start"
      dropdownComponents={
        <DropdownContent widthInPixels={GenericDropdownContentWidth.Medium}>
          <DropdownMenuItemsContainer>
            <MenuItemSelect
              LeftIcon={IconSquareX}
              text={t`No record selected`}
              selected={!hasRecordSelection}
              onClick={handleSelectNoRecord}
            />
            <MenuItemSelect
              LeftIcon={IconSquareCheck}
              text={t`Record(s) selected`}
              selected={hasRecordSelection}
              onClick={handleSelectRecord}
            />
          </DropdownMenuItemsContainer>
        </DropdownContent>
      }
    />
  );
};
