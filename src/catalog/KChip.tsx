import { type FC } from 'react';
import { Chip } from 'konsta/react';
import type { ComponentProps } from './index';
import { resolveImage } from '../utils/smartAssets';

const colorMap: Record<string, { fill: string; outline: string }> = {
  primary: { fill: 'bg-primary text-white', outline: 'text-primary border-primary' },
  blue: { fill: 'bg-blue-500 text-white', outline: 'text-blue-500 border-blue-500' },
  red: { fill: 'bg-red-500 text-white', outline: 'text-red-500 border-red-500' },
  green: { fill: 'bg-green-500 text-white', outline: 'text-green-500 border-green-500' },
  yellow: { fill: 'bg-yellow-500 text-white', outline: 'text-yellow-500 border-yellow-500' },
  orange: { fill: 'bg-orange-500 text-white', outline: 'text-orange-500 border-orange-500' },
  purple: { fill: 'bg-purple-500 text-white', outline: 'text-purple-500 border-purple-500' },
  pink: { fill: 'bg-pink-500 text-white', outline: 'text-pink-500 border-pink-500' },
  gray: { fill: 'bg-gray-500 text-white', outline: 'text-gray-500 border-gray-500' },
};

const KChip: FC<ComponentProps> = ({ node, children }) => {
  const text = node.props?.text as string;
  const outline = node.props?.outline === true;
  const media = node.props?.media as string;
  const deleteButton = node.props?.deletable === true;
  const color = node.props?.color as string | undefined;
  const small = node.props?.small === true;
  const className = (node.props?.className as string) || '';

  const colorClasses = color && colorMap[color]
    ? outline ? colorMap[color].outline : colorMap[color].fill
    : '';

  return (
    <Chip
      outline={outline}
      deleteButton={deleteButton}
      className={`${colorClasses} ${small ? 'text-xs scale-90 origin-left' : ''} ${className}`.trim()}
      media={
        media ? (() => {
          const resolved = resolveImage(media, node.id) || media;
          return (resolved.startsWith('http') || resolved.startsWith('/')) ? (
            <img src={resolved} alt="" className="w-6 h-6 rounded-full object-cover" />
          ) : (
            <span className="flex items-center justify-center w-6 h-6 rounded-full">
              <ion-icon name={resolved} style={{ fontSize: '18px' }} />
            </span>
          );
        })() : undefined
      }
    >
      {text || children}
    </Chip>
  );
};

KChip.displayName = 'KChip';

export default KChip;
