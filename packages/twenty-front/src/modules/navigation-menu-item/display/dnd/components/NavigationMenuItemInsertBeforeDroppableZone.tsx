import { pointerIntersection } from '@dnd-kit/collision';
import { useDroppable } from '@dnd-kit/react';
import { styled } from '@linaria/react';

import type { DroppableData } from '@/navigation-menu-item/common/types/navigationMenuItemDndKitDroppableData';
import { getDndKitDropTargetId } from '@/navigation-menu-item/common/utils/getDndKitDropTargetId';

const INSERT_BEFORE_ZONE_HEIGHT_PX = 10;

const StyledInsertBeforeZone = styled.div`
  position: absolute;
  top: -${INSERT_BEFORE_ZONE_HEIGHT_PX}px;
  left: 0;
  right: 0;
  height: ${INSERT_BEFORE_ZONE_HEIGHT_PX}px;
  z-index: 1;
  pointer-events: auto;
`;

type NavigationMenuItemInsertBeforeDroppableZoneProps = {
  orphanDroppableId: string;
  orphanIndex: number;
  itemId: string;
  disabled?: boolean;
};

export const NavigationMenuItemInsertBeforeDroppableZone = ({
  orphanDroppableId,
  orphanIndex,
  itemId,
  disabled = false,
}: NavigationMenuItemInsertBeforeDroppableZoneProps) => {
  const id = getDndKitDropTargetId(orphanDroppableId, orphanIndex);
  const data: DroppableData = {
    droppableId: orphanDroppableId,
    index: orphanIndex,
    insertBeforeItemId: itemId,
  };
  const { ref } = useDroppable({
    id,
    disabled,
    collisionPriority: 5,
    collisionDetector: pointerIntersection,
    data,
  });

  return <StyledInsertBeforeZone ref={ref} />;
};
