import { contextStoreNumberOfSelectedRecordsComponentState } from '@/context-store/states/contextStoreNumberOfSelectedRecordsComponentState';
import { contextStoreCurrentViewIdComponentState } from '@/context-store/states/contextStoreCurrentViewIdComponentState';
import { contextStoreCurrentObjectMetadataItemIdComponentState } from '@/context-store/states/contextStoreCurrentObjectMetadataItemIdComponentState';
import { contextStoreTargetedRecordsRuleComponentState } from '@/context-store/states/contextStoreTargetedRecordsRuleComponentState';
import { MAIN_CONTEXT_STORE_INSTANCE_ID } from '@/context-store/constants/MainContextStoreInstanceId';
import { COMMAND_MENU_DROPDOWN_CLICK_OUTSIDE_ID } from '@/command-menu-item/constants/CommandMenuDropdownClickOutsideId';
import { objectMetadataItemsSelector } from '@/object-metadata/states/objectMetadataItemsSelector';
import { selectedRowIdsComponentSelector } from '@/object-record/record-table/states/selectors/selectedRowIdsComponentSelector';
import { getRecordIndexIdFromObjectNamePluralAndViewId } from '@/object-record/utils/getRecordIndexIdFromObjectNamePluralAndViewId';
import { Dropdown } from '@/ui/layout/dropdown/components/Dropdown';
import { DropdownContent } from '@/ui/layout/dropdown/components/DropdownContent';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { GenericDropdownContentWidth } from '@/ui/layout/dropdown/constants/GenericDropdownContentWidth';
import { useCloseDropdown } from '@/ui/layout/dropdown/hooks/useCloseDropdown';
import { useAtomComponentSelectorValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentSelectorValue';
import { useAtomComponentStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomComponentStateValue';
import { useSetAtomComponentState } from '@/ui/utilities/state/jotai/hooks/useSetAtomComponentState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { styled } from '@linaria/react';
import { useLingui } from '@lingui/react/macro';
import { useEffect, useMemo } from 'react';
import {
  IconChevronDown,
  IconCheckbox,
  IconSquareCheck,
  IconSquareX,
} from 'twenty-ui/display';
import { MenuItemSelect } from 'twenty-ui/navigation';
import { themeCssVariables } from 'twenty-ui/theme-constants';

const DROPDOWN_ID = 'command-menu-edit-record-selection-dropdown';
const MULTIPLE_RECORDS_PREVIEW_COUNT = 2;

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

const StyledDropdownMenuContainer = styled.div`
  width: 100%;
`;

export const CommandMenuEditRecordSelectionDropdown = () => {
  const { t } = useLingui();
  const { closeDropdown } = useCloseDropdown();

  const contextStoreTargetedRecordsRule = useAtomComponentStateValue(
    contextStoreTargetedRecordsRuleComponentState,
  );
  const contextStoreCurrentObjectMetadataItemId = useAtomComponentStateValue(
    contextStoreCurrentObjectMetadataItemIdComponentState,
    MAIN_CONTEXT_STORE_INSTANCE_ID,
  );
  const contextStoreCurrentViewId = useAtomComponentStateValue(
    contextStoreCurrentViewIdComponentState,
    MAIN_CONTEXT_STORE_INSTANCE_ID,
  );
  const objectMetadataItems = useAtomStateValue(objectMetadataItemsSelector);
  const mainContextObjectMetadataItem = objectMetadataItems.find(
    (item) => item.id === contextStoreCurrentObjectMetadataItemId,
  );
  const mainRecordIndexId = useMemo(
    () =>
      getRecordIndexIdFromObjectNamePluralAndViewId(
        mainContextObjectMetadataItem?.namePlural ?? '',
        contextStoreCurrentViewId ?? '',
      ),
    [mainContextObjectMetadataItem?.namePlural, contextStoreCurrentViewId],
  );
  const selectedRowIds = useAtomComponentSelectorValue(
    selectedRowIdsComponentSelector,
    mainRecordIndexId,
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

  const singleRecordPreviewId =
    selectedRowIds.length === 1 ? selectedRowIds[0] : undefined;
  const canPreviewSingleRecord = singleRecordPreviewId !== undefined;

  const previewMode =
    contextStoreTargetedRecordsRule.mode === 'selection'
      ? selectedRecordIds.length === 0
        ? 'none'
        : selectedRecordIds.length === 1
          ? 'single'
          : 'multiple'
      : 'multiple';

  const handleSelectNoRecord = () => {
    setContextStoreTargetedRecordsRule({
      mode: 'selection',
      selectedRecordIds: [],
    });
    setContextStoreNumberOfSelectedRecords(0);
    closeDropdown(DROPDOWN_ID);
  };

  const handleSelectSingleRecord = () => {
    if (singleRecordPreviewId === undefined) {
      return;
    }

    setContextStoreTargetedRecordsRule({
      mode: 'selection',
      selectedRecordIds: [singleRecordPreviewId],
    });
    setContextStoreNumberOfSelectedRecords(1);
    closeDropdown(DROPDOWN_ID);
  };

  const handleSelectMultipleRecords = () => {
    setContextStoreTargetedRecordsRule({
      mode: 'exclusion',
      excludedRecordIds: [],
    });
    setContextStoreNumberOfSelectedRecords(MULTIPLE_RECORDS_PREVIEW_COUNT);
    closeDropdown(DROPDOWN_ID);
  };

  const isSingleRecordPreviewMode =
    contextStoreTargetedRecordsRule.mode === 'selection' &&
    contextStoreTargetedRecordsRule.selectedRecordIds.length === 1;
  const currentSingleSelectedRecordId =
    selectedRecordIds.length === 1 ? selectedRecordIds[0] : undefined;

  useEffect(() => {
    if (!isSingleRecordPreviewMode) {
      return;
    }

    if (selectedRowIds.length === 1) {
      const [selectedRowId] = selectedRowIds;

      if (selectedRowId !== currentSingleSelectedRecordId) {
        setContextStoreTargetedRecordsRule({
          mode: 'selection',
          selectedRecordIds: [selectedRowId],
        });
        setContextStoreNumberOfSelectedRecords(1);
      }

      return;
    }

    setContextStoreTargetedRecordsRule({
      mode: 'selection',
      selectedRecordIds: [],
    });
    setContextStoreNumberOfSelectedRecords(0);
  }, [
    currentSingleSelectedRecordId,
    isSingleRecordPreviewMode,
    selectedRowIds,
    setContextStoreNumberOfSelectedRecords,
    setContextStoreTargetedRecordsRule,
  ]);

  const TriggerIcon = previewMode === 'none' ? IconSquareX : IconSquareCheck;
  const triggerLabel =
    previewMode === 'none'
      ? t`No record selected`
      : previewMode === 'single'
        ? t`Single record selected`
        : t`Multiple records selected`;

  return (
    <Dropdown
      dropdownId={DROPDOWN_ID}
      clickableComponent={
        <StyledClickableArea
          data-click-outside-id={COMMAND_MENU_DROPDOWN_CLICK_OUTSIDE_ID}
        >
          <TriggerIcon size={16} />
          <StyledLabel>{triggerLabel}</StyledLabel>
          <IconChevronDown size={16} />
        </StyledClickableArea>
      }
      dropdownPlacement="bottom-start"
      dropdownComponents={
        <DropdownContent widthInPixels={GenericDropdownContentWidth.Medium}>
          <StyledDropdownMenuContainer
            data-click-outside-id={COMMAND_MENU_DROPDOWN_CLICK_OUTSIDE_ID}
          >
            <DropdownMenuItemsContainer>
              <MenuItemSelect
                LeftIcon={IconSquareX}
                text={t`No record selected`}
                selected={previewMode === 'none'}
                onClick={handleSelectNoRecord}
              />
              <MenuItemSelect
                LeftIcon={IconSquareCheck}
                text={t`Single record selected`}
                selected={previewMode === 'single'}
                disabled={!canPreviewSingleRecord}
                contextualText={
                  !canPreviewSingleRecord ? t`Select one row first` : undefined
                }
                contextualTextPosition="right"
                onClick={
                  canPreviewSingleRecord ? handleSelectSingleRecord : undefined
                }
              />
              <MenuItemSelect
                LeftIcon={IconCheckbox}
                text={t`Multiple records selected`}
                selected={previewMode === 'multiple'}
                onClick={handleSelectMultipleRecords}
              />
            </DropdownMenuItemsContainer>
          </StyledDropdownMenuContainer>
        </DropdownContent>
      }
    />
  );
};
