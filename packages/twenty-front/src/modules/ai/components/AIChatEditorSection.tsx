import { styled } from '@linaria/react';
import { useMutation } from '@apollo/client/react';
import { EditorContent } from '@tiptap/react';
import { t } from '@lingui/core/macro';
import { IconTwentyStar } from 'twenty-ui/display';
import { themeCssVariables } from 'twenty-ui/theme-constants';

import { AIChatEmptyState } from '@/ai/components/AIChatEmptyState';
import { AIChatStandaloneError } from '@/ai/components/AIChatStandaloneError';
import { AgentChatContextPreview } from '@/ai/components/internal/AgentChatContextPreview';
import { AgentChatFileUploadButton } from '@/ai/components/internal/AgentChatFileUploadButton';
import { AIChatContextUsageButton } from '@/ai/components/internal/AIChatContextUsageButton';
import { AIChatEditorFocusEffect } from '@/ai/components/internal/AIChatEditorFocusEffect';
import { AIChatSkeletonLoader } from '@/ai/components/internal/AIChatSkeletonLoader';
import { SendMessageButton } from '@/ai/components/internal/SendMessageButton';
import { DEFAULT_SMART_MODEL } from '@/ai/constants/DefaultSmartModel';
import { useAIChatEditor } from '@/ai/hooks/useAIChatEditor';
import { useWorkspaceAiModelAvailability } from '@/ai/hooks/useWorkspaceAiModelAvailability';
import { currentWorkspaceState } from '@/auth/states/currentWorkspaceState';
import { aiModelsState } from '@/client-config/states/aiModelsState';
import { getModelIcon } from '@/settings/admin-panel/ai/utils/getModelIcon';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { Select } from '@/ui/input/components/Select';
import { GenericDropdownContentWidth } from '@/ui/layout/dropdown/constants/GenericDropdownContentWidth';
import { useIsMobile } from '@/ui/utilities/responsive/hooks/useIsMobile';
import { useAtomState } from '@/ui/utilities/state/jotai/hooks/useAtomState';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { UpdateWorkspaceDocument } from '~/generated-metadata/graphql';

const StyledInputArea = styled.div<{ isMobile: boolean }>`
  align-items: flex-end;
  background: ${themeCssVariables.background.primary};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  gap: ${themeCssVariables.spacing[2]};
  padding-block: ${({ isMobile }) =>
    isMobile ? '0' : themeCssVariables.spacing[3]};
  padding-inline: ${themeCssVariables.spacing[3]};
`;

const StyledInputBox = styled.div`
  background-color: ${themeCssVariables.background.transparent.lighter};
  border: 1px solid ${themeCssVariables.border.color.medium};
  border-radius: ${themeCssVariables.border.radius.sm};
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: ${themeCssVariables.spacing[2]};
  min-height: 140px;
  padding: ${themeCssVariables.spacing[2]};
  width: 100%;

  &:focus-within {
    border-color: ${themeCssVariables.color.blue};
    box-shadow: 0px 0px 0px 3px ${themeCssVariables.color.transparent.blue2};
  }
`;

const StyledEditorWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-height: 0;

  .tiptap {
    background: transparent;
    border: none;
    box-shadow: none;
    color: ${themeCssVariables.font.color.primary};
    font-family: inherit;
    font-size: ${themeCssVariables.font.size.md};
    font-weight: ${themeCssVariables.font.weight.regular};
    line-height: 16px;
    max-height: 320px;
    min-height: 48px;
    outline: none;
    overflow-y: auto;
    padding: 0;

    p {
      margin: 0;
    }

    p.is-editor-empty:first-of-type::before {
      color: ${themeCssVariables.font.color.light};
      content: attr(data-placeholder);
      float: left;
      font-weight: ${themeCssVariables.font.weight.regular};
      height: 0;
      pointer-events: none;
    }
  }
`;

const StyledButtonsContainer = styled.div`
  align-items: center;
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const StyledLeftButtonsContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing['0.5']};
`;

const StyledRightButtonsContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${themeCssVariables.spacing[1]};
`;

export const AIChatEditorSection = () => {
  const isMobile = useIsMobile();
  const { enqueueErrorSnackBar } = useSnackBar();
  const [currentWorkspace, setCurrentWorkspace] =
    useAtomState(currentWorkspaceState);
  const [updateWorkspace] = useMutation(UpdateWorkspaceDocument);
  const aiModels = useAtomStateValue(aiModelsState);
  const { enabledModels } = useWorkspaceAiModelAvailability();

  const { editor, handleSendAndClear } = useAIChatEditor();

  const currentSmartModel = currentWorkspace?.smartModel;

  const buildVirtualModelOption = (virtualModelId: string) => {
    const virtualModel = aiModels.find(
      (model) => model.modelId === virtualModelId,
    );

    return virtualModel
      ? {
          value: virtualModelId,
          label: virtualModel.label,
          Icon: IconTwentyStar,
        }
      : null;
  };

  const smartAutoOption = buildVirtualModelOption(DEFAULT_SMART_MODEL);

  const smartModelOptions = enabledModels.map((model) => ({
    value: model.modelId,
    label: model.label,
    Icon: getModelIcon(model.modelFamily, model.providerName),
  }));

  if (smartAutoOption !== null) {
    smartModelOptions.unshift(smartAutoOption);
  }

  const handleSmartModelChange = async (value: string) => {
    if (!currentWorkspace?.id) {
      return;
    }

    const previousValue = currentWorkspace.smartModel;

    try {
      setCurrentWorkspace({
        ...currentWorkspace,
        smartModel: value,
      });

      await updateWorkspace({
        variables: {
          input: {
            smartModel: value,
          },
        },
      });
    } catch {
      setCurrentWorkspace({
        ...currentWorkspace,
        smartModel: previousValue,
      });

      enqueueErrorSnackBar({
        message: t`Failed to update model`,
      });
    }
  };

  return (
    <>
      <AIChatEditorFocusEffect editor={editor} />
      <AIChatEmptyState editor={editor} />
      <AIChatStandaloneError />
      <AIChatSkeletonLoader />

      <StyledInputArea isMobile={isMobile}>
        <AgentChatContextPreview />
        <StyledInputBox>
          <StyledEditorWrapper>
            <EditorContent editor={editor} />
          </StyledEditorWrapper>
          <StyledButtonsContainer>
            <StyledLeftButtonsContainer>
              <AgentChatFileUploadButton />
              <AIChatContextUsageButton />
            </StyledLeftButtonsContainer>
            <StyledRightButtonsContainer>
              <Select
                dropdownId="ai-chat-smart-model-select"
                value={currentSmartModel}
                onChange={handleSmartModelChange}
                options={smartModelOptions}
                selectSizeVariant="small"
                dropdownWidth={GenericDropdownContentWidth.ExtraLarge}
              />
              <SendMessageButton onSend={handleSendAndClear} />
            </StyledRightButtonsContainer>
          </StyledButtonsContainer>
        </StyledInputBox>
      </StyledInputArea>
    </>
  );
};
