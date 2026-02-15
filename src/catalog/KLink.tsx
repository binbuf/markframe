import { type FC } from 'react';
import { Link } from 'konsta/react';
import type { ComponentProps } from './index';
import { useNavigateOrOverlay } from './useNavigateOrOverlay';

const KLink: FC<ComponentProps> = ({ node, children }) => {
  const handleNavigation = useNavigateOrOverlay();
  const navigateTo = node.props?.navigateTo as string | undefined;
  const text = node.props?.text as string;
  // Support 'icon' prop as alias for iconLeft if iconLeft is not set
  const iconLeft = (node.props?.iconLeft as string) || (node.props?.icon as string);
  const iconRight = node.props?.iconRight as string;
  const push = node.props?.push === true;

  return (
    <Link
      onClick={navigateTo ? (e: React.MouseEvent) => {
        e.preventDefault();
        handleNavigation(navigateTo);
      } : undefined}
      iconOnly={!text && !children}
      className={push ? 'ml-auto' : undefined}
    >
      {iconLeft && (
        <ion-icon
          name={iconLeft}
          style={{ fontSize: '20px', marginRight: '4px' }}
        />
      )}
      {text || children}
      {iconRight && (
        <ion-icon
          name={iconRight}
          style={{ fontSize: '20px', marginLeft: '4px' }}
        />
      )}
    </Link>
  );
};

KLink.displayName = 'KLink';

export default KLink;
