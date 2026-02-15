import { type FC } from 'react';
import { Card } from 'konsta/react';
import type { ComponentProps } from './index';
import { resolveImage } from '../utils/smartAssets';

const KMediaCard: FC<ComponentProps> = ({ node, children }) => {
  const title = (node.props?.title as string) || '';
  const subtitle = node.props?.subtitle as string | undefined;
  const image = resolveImage(node.props?.image as string | undefined, node.id);
  const imageHeight = (node.props?.imageHeight as number) ?? 128;
  const width = node.props?.width as number | string | undefined;
  const footer = node.props?.footer as string | undefined;
  const rating = node.props?.rating as string | number | undefined;
  const tags = node.props?.tags as string[] | undefined;
  const className = (node.props?.className as string) || '';

  const style: React.CSSProperties = {};
  if (width !== undefined) {
    if (typeof width === 'number') {
      style.width = width;
    } else if (/^\d+$/.test(width)) {
      style.width = parseInt(width, 10);
    } else {
      style.width = width;
    }
  }

  return (
    <Card
      outline
      footer={footer || undefined}
      className={`my-4 !p-0 overflow-hidden shrink-0 ${className}`}
      style={style}
    >
      {image && (
        <img
          src={image}
          alt={title}
          className="w-full object-cover"
          style={{ height: `${imageHeight}px`, display: 'block' }}
        />
      )}
      <div className="p-3">
        <div className="flex items-center justify-between">
          {title && <p className="font-medium text-sm">{title}</p>}
          {rating !== undefined && (
            <span className="bg-gray-100 rounded-full px-2 py-0.5 text-xs font-medium shrink-0 ml-2">
              {rating} ★
            </span>
          )}
        </div>
        {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {tags.map((tag, i) => (
              <span key={i} className="text-xs border rounded-full px-2 py-0.5 text-gray-600">{tag}</span>
            ))}
          </div>
        )}
        {children}
      </div>
    </Card>
  );
};

KMediaCard.displayName = 'KMediaCard';

export default KMediaCard;
