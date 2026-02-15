import { type FC } from 'react';
import { Actions, ActionsGroup, ActionsButton, ActionsLabel } from 'konsta/react';
import type { ComponentProps } from './index';
import type { MarkframeNode } from '../types/markframe';
import { useOverlay } from './OverlayContext';

function renderActionsChildren(children: MarkframeNode[], onClose: () => void) {
  // If children contain ActionsGroup nodes, render grouped
  const groups = children.filter(c => c.type === 'ActionsGroup');
  if (groups.length > 0) {
    return groups.map((group, gi) => (
      <ActionsGroup key={gi}>
        {(group.children || []).map((btn, bi) => (
          <ActionsButton
            key={bi}
            bold={btn.props?.bold === true}
            colors={btn.props?.destructive === true ? {
              textIos: 'text-red-500',
              textMaterial: 'text-red-500 dark:text-red-400',
            } : undefined}
            onClick={onClose}
          >
            {(btn.props?.label as string) || ''}
          </ActionsButton>
        ))}
      </ActionsGroup>
    ));
  }

  // If children are direct ActionsButton nodes, wrap in a single group
  const buttons = children.filter(c => c.type === 'ActionsButton');
  if (buttons.length > 0) {
    return (
      <ActionsGroup>
        {buttons.map((btn, bi) => (
          <ActionsButton
            key={bi}
            bold={btn.props?.bold === true}
            colors={btn.props?.destructive === true ? {
              textIos: 'text-red-500',
              textMaterial: 'text-red-500 dark:text-red-400',
            } : undefined}
            onClick={onClose}
          >
            {(btn.props?.label as string) || ''}
          </ActionsButton>
        ))}
      </ActionsGroup>
    );
  }

  return null;
}

const KActions: FC<ComponentProps> = ({ node }) => {
  const { activeOverlays, closeOverlay } = useOverlay();
  const title = node.props?.title as string;

  const customId = node.props?.id as string;
  const ids = [node.id, customId].filter(Boolean) as string[];

  const isStaticOpen = node.props?.opened === true;
  const isDynamicOpen = ids.some(id => activeOverlays.has(id));
  const opened = isStaticOpen || isDynamicOpen;

  if (!opened) return null;

  const handleClose = () => {
    ids.forEach(id => closeOverlay(id));
  };

  // Check for markframe child nodes (ActionsGroup/ActionsButton)
  const actionChildren = (node.children || []).filter(
    c => c.type === 'ActionsGroup' || c.type === 'ActionsButton'
  );
  const hasChildNodes = actionChildren.length > 0;

  return (
    <Actions
      opened={opened}
      onBackdropClick={handleClose}
    >
      {title && (
        <ActionsGroup>
          <ActionsLabel>{title}</ActionsLabel>
        </ActionsGroup>
      )}

      {hasChildNodes
        ? renderActionsChildren(actionChildren, handleClose)
        : (
          <ActionsGroup>
            <ActionsButton bold onClick={handleClose}>Cancel</ActionsButton>
          </ActionsGroup>
        )
      }
    </Actions>
  );
};

KActions.displayName = 'KActions';

export default KActions;

