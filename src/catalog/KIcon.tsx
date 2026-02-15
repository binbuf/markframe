import { type FC } from 'react';
import type { ComponentProps } from './index';
import type { IoniconsName, IoniconsVariant } from '../types/icons';

const KIcon: FC<ComponentProps> = ({ node }) => {
  const name = (node.props?.name as IoniconsName) || 'home';
  const variant = (node.props?.variant as IoniconsVariant) || 'outline';
  const size = node.props?.size || 'medium';
  const color = node.props?.color as string;

  let sizeValue: string;
  if (typeof size === 'number') {
    sizeValue = `${size}px`;
  } else {
    switch (size) {
      case 'small':
        sizeValue = '20px';
        break;
      case 'large':
        sizeValue = '32px';
        break;
      case 'medium':
      default:
        sizeValue = '24px';
        break;
    }
  }

  // Construct icon name with variant
  const iconName = variant === 'outline' ? `${name}-outline` :
                   variant === 'sharp' ? `${name}-sharp` :
                   name; // filled variant uses base name

  const push = node.props?.push === true;

  const icon = (
    <ion-icon
      name={iconName}
      style={{
        fontSize: sizeValue,
        color: color || 'currentColor',
        verticalAlign: 'middle',
      }}
    />
  );

  if (push) {
    return <span className="ml-auto">{icon}</span>;
  }

  return icon;
};

KIcon.displayName = 'KIcon';

export default KIcon;
