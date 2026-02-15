import { type FC } from 'react';
import type { ComponentProps } from './index';
import { resolveAvatar } from '../utils/smartAssets';

const KAvatar: FC<ComponentProps> = ({ node }) => {
  const rawSrc = node.props?.src as string | undefined;
  const gender = node.props?.gender as string | undefined;
  const size = (node.props?.size as number) ?? 40;
  const border = node.props?.border as string | undefined;
  const badge = node.props?.badge as string | undefined;
  const placeholder = node.props?.placeholder as string | undefined;
  const className = (node.props?.className as string) || '';

  // If explicit URL/path, use it; otherwise auto-assign from local pool
  const src = rawSrc && (rawSrc.startsWith('http') || rawSrc.startsWith('/'))
    ? rawSrc
    : rawSrc ? rawSrc : (!placeholder ? resolveAvatar(node.id, gender) : '');

  const noSuffixColors = ['white', 'black', 'transparent'];
  const borderClasses = border ? `border-2 ${noSuffixColors.includes(border) ? `border-${border}` : `border-${border}-500`} p-0.5` : '';

  if (!src && placeholder) {
    return (
      <div
        className={`relative inline-flex items-center justify-center rounded-full bg-gray-200 shrink-0 ${borderClasses} ${className}`}
        style={{ width: `${size}px`, height: `${size}px` }}
      >
        <ion-icon name={placeholder} style={{ fontSize: `${size * 0.5}px` }} />
        {badge && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
            {badge}
          </span>
        )}
      </div>
    );
  }

  return (
    <div className={`relative inline-block shrink-0 ${className}`}>
      <img
        src={src}
        alt=""
        className={`rounded-full object-cover shrink-0 ${borderClasses}`}
        style={{ width: `${size}px`, height: `${size}px`, display: 'block' }}
      />
      {badge && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1">
          {badge}
        </span>
      )}
    </div>
  );
};

KAvatar.displayName = 'KAvatar';

export default KAvatar;
