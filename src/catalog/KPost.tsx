import { type FC } from 'react';
import type { ComponentProps } from './index';
import { resolveAvatar, resolveImage } from '../utils/smartAssets';

const KPost: FC<ComponentProps> = ({ node }) => {
  const text = (node.props?.text as string) || '';
  const author = (node.props?.author as string) || '';
  const avatarProp = node.props?.avatar;
  const avatar = typeof avatarProp === 'string' && (avatarProp.startsWith('http') || avatarProp.startsWith('/'))
    ? avatarProp
    : resolveAvatar(node.id);
  const verified = node.props?.verified === true;
  const time = node.props?.time as string | undefined;
  const image = resolveImage(node.props?.image as string | undefined, node.id);
  const likes = node.props?.likes as string | undefined;
  const comments = node.props?.comments as string | undefined;
  const reposts = node.props?.reposts as string | undefined;
  const liked = node.props?.liked === true;
  const className = (node.props?.className as string) || '';

  return (
    <div className={`px-4 py-3 ${className}`}>
      {/* Author row */}
      <div className="flex items-center gap-3 mb-2">
        {avatar && (
          <img
            src={avatar}
            alt={author}
            className="w-10 h-10 rounded-full object-cover shrink-0"
          />
        )}
        <div className="flex items-center gap-1 flex-1 min-w-0">
          <span className="font-semibold text-sm truncate">{author}</span>
          {verified && (
            <ion-icon
              name="checkmark-circle"
              style={{ fontSize: '16px', color: '#3b82f6', flexShrink: 0 }}
            />
          )}
          {time && <span className="text-xs text-gray-500 ml-1">· {time}</span>}
        </div>
      </div>

      {/* Body text */}
      {text && <p className="text-sm mb-2 whitespace-pre-wrap">{text}</p>}

      {/* Optional image */}
      {image && (
        <img
          src={image}
          alt=""
          className="w-full rounded-lg mb-2"
          style={{ display: 'block' }}
        />
      )}

      {/* Action bar */}
      <div className="flex items-center gap-5 mt-1">
        <div className="flex items-center gap-1">
          <ion-icon
            name={liked ? 'heart' : 'heart-outline'}
            style={{ fontSize: '20px', color: liked ? '#ef4444' : '#6b7280' }}
          />
          {likes && <span className="text-xs text-gray-500">{likes}</span>}
        </div>
        <div className="flex items-center gap-1">
          <ion-icon
            name="chatbubble-outline"
            style={{ fontSize: '20px', color: '#6b7280' }}
          />
          {comments && <span className="text-xs text-gray-500">{comments}</span>}
        </div>
        <div className="flex items-center gap-1">
          <ion-icon
            name="repeat-outline"
            style={{ fontSize: '20px', color: '#6b7280' }}
          />
          {reposts && <span className="text-xs text-gray-500">{reposts}</span>}
        </div>
        <div className="flex items-center gap-1">
          <ion-icon
            name="share-outline"
            style={{ fontSize: '20px', color: '#6b7280' }}
          />
        </div>
      </div>
    </div>
  );
};

KPost.displayName = 'KPost';

export default KPost;
