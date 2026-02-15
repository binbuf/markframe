import { type FC } from 'react';
import type { ComponentProps } from './index';
import { resolveAvatar } from '../utils/smartAssets';
import { resolveColor } from './colorUtils';

const KMessage: FC<ComponentProps> = ({ node }) => {
  const text = (node.props?.text as string) || '';
  const time = node.props?.time as string | undefined;
  const sent = node.props?.sent === true;
  const avatarProp = node.props?.avatar;
  const avatar = !avatarProp ? undefined
    : typeof avatarProp === 'string' && (avatarProp.startsWith('http') || avatarProp.startsWith('/'))
      ? avatarProp
      : resolveAvatar(node.id);
  const color = (node.props?.color as string) || 'green';
  const read = node.props?.read === true;
  const className = (node.props?.className as string) || '';

  // Map common color names to their -500 variant
  const colorMap: Record<string, string> = {
    green: 'green-500',
    blue: 'blue-500',
    purple: 'purple-500',
    indigo: 'indigo-500',
  };

  if (sent) {
    // Resolve color to Tailwind color name or pass through
    const colorName = colorMap[color] || (color.includes('-') ? color : `${color}-500`);
    const bubbleColor = resolveColor(colorName);
    return (
      <div className={`flex justify-end mb-4 ${className}`}>
        <div className="flex flex-col items-end max-w-[75%]">
          <div
            className="rounded-2xl rounded-br-none p-3 shadow-sm"
            style={{ backgroundColor: bubbleColor }}
          >
            <p className="text-white text-sm">{text}</p>
          </div>
          {(time || read) && (
            <div className="flex items-center gap-1 mt-1 mr-1">
              {time && <span className="text-xs text-gray-500">{time}</span>}
              {read && <span className="text-xs text-blue-500">✓✓</span>}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Received message
  return (
    <div className={`flex items-end gap-2 mb-4 ${className}`}>
      {avatar && (
        <img
          src={avatar}
          alt=""
          className="w-8 h-8 rounded-full object-cover shrink-0"
        />
      )}
      <div className="max-w-[75%]">
        <div className="bg-white rounded-2xl rounded-bl-none p-3 shadow-sm">
          <p className="text-sm text-gray-900">{text}</p>
        </div>
        {time && (
          <span className="text-xs text-gray-500 mt-1 block">{time}</span>
        )}
      </div>
    </div>
  );
};

KMessage.displayName = 'KMessage';

export default KMessage;
