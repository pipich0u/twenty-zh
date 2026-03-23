import { computeReorderPositionForCommandMenuItemInDraft } from '@/command-menu-item/server-items/edit/utils/computeReorderPositionForCommandMenuItemInDraft';

const makeItem = (id: string, position: number, isPinned: boolean) => ({
  id,
  position,
  isPinned,
});

describe('computeReorderPositionForCommandMenuItemInDraft', () => {
  it('should place item between two pinned items when moving to middle', () => {
    const items = [
      makeItem('a', 0, true),
      makeItem('b', 2, true),
      makeItem('c', 4, true),
    ];

    const result = computeReorderPositionForCommandMenuItemInDraft(
      items,
      'a',
      1,
      'pinned',
    );

    expect(result).toBe(3);
  });

  it('should place item after last pinned item when moving to end', () => {
    const items = [
      makeItem('a', 0, true),
      makeItem('b', 2, true),
      makeItem('c', 4, true),
    ];

    const result = computeReorderPositionForCommandMenuItemInDraft(
      items,
      'a',
      2,
      'pinned',
    );

    expect(result).toBe(5);
  });

  it('should place item before first pinned item when moving to start', () => {
    const items = [
      makeItem('a', 0, true),
      makeItem('b', 2, true),
      makeItem('c', 4, true),
    ];

    const result = computeReorderPositionForCommandMenuItemInDraft(
      items,
      'c',
      0,
      'pinned',
    );

    expect(result).toBe(-1);
  });

  it('should return undefined when section is empty after removing source', () => {
    const items = [makeItem('a', 0, true)];

    const result = computeReorderPositionForCommandMenuItemInDraft(
      items,
      'a',
      0,
      'pinned',
    );

    expect(result).toBeUndefined();
  });

  it('should only consider items in the target section', () => {
    const items = [
      makeItem('a', 0, true),
      makeItem('b', 1, false),
      makeItem('c', 2, false),
    ];

    const result = computeReorderPositionForCommandMenuItemInDraft(
      items,
      'b',
      1,
      'other',
    );

    expect(result).toBe(3);
  });

  it('should resolve bounds against full section when contextualItemIds filters items', () => {
    const items = [
      makeItem('a', 0, true),
      makeItem('hidden', 1, true),
      makeItem('b', 2, true),
      makeItem('c', 4, true),
    ];

    const contextualItemIds = new Set(['a', 'b', 'c']);

    const result = computeReorderPositionForCommandMenuItemInDraft(
      items,
      'c',
      1,
      'pinned',
      contextualItemIds,
    );

    expect(result).toBe(1.5);
  });

  it('should clamp destination index to valid range', () => {
    const items = [makeItem('a', 0, true), makeItem('b', 2, true)];

    const result = computeReorderPositionForCommandMenuItemInDraft(
      items,
      'a',
      99,
      'pinned',
    );

    expect(result).toBe(3);
  });
});
