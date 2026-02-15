import { type FC } from 'react';
import type { ComponentProps } from './index';
import { resolveAvatar } from '../utils/smartAssets';

const KStoryRow: FC<ComponentProps> = ({ node }) => {
  const size = (node.props?.size as number) ?? 64;
  const border = (node.props?.border as string) || 'pink';
  const className = (node.props?.className as string) || '';

  // Consume child Story nodes directly
  const stories = (node.children || []).filter(c => c.type === 'Story');

  const noSuffix = ['white', 'black', 'transparent'];
  const borderClass = noSuffix.includes(border) ? `border-${border}` : `border-${border}-500`;

  return (
    <div className={`flex flex-row gap-3 overflow-x-auto p-2 [&>*]:shrink-0 ${className}`}>
      {stories.map((story, i) => {
        const label = (story.props?.label as string) || '';
        const add = story.props?.add === true;
        const rawAvatar = story.props?.avatar as string | undefined;
        const avatarSrc = rawAvatar && (rawAvatar.startsWith('http') || rawAvatar.startsWith('/'))
          ? rawAvatar
          : !add ? resolveAvatar(story.id || `${node.id}-story-${i}`) : undefined;

        return (
          <div key={i} className="flex flex-col items-center gap-1" style={{ width: `${size}px` }}>
            <div
              className={`rounded-full overflow-hidden border-2 ${borderClass} flex items-center justify-center bg-gray-100`}
              style={{ width: `${size}px`, height: `${size}px` }}
            >
              {add ? (
                <ion-icon name="add" style={{ fontSize: `${Math.round(size * 0.4)}px`, color: '#3b82f6' }} />
              ) : avatarSrc ? (
                <img src={avatarSrc} alt={label} className="w-full h-full object-cover" />
              ) : (
                <ion-icon name="person" style={{ fontSize: `${Math.round(size * 0.5)}px`, color: '#9ca3af' }} />
              )}
            </div>
            {label && <span className="text-xs text-center truncate w-full">{label}</span>}
          </div>
        );
      })}
    </div>
  );
};

KStoryRow.displayName = 'KStoryRow';

export default KStoryRow;
