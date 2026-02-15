import React, { type FC } from 'react';
import { Navbar, NavbarBackLink, Link } from 'konsta/react';
import type { ComponentProps } from './index';
import { useNavigation } from './NavigationContext';

// Child types that belong in the subnavbar area instead of the right slot
const SUBNAVBAR_TYPES = new Set(['Segmented']);

const KNavbar: FC<ComponentProps> = ({ node, children }) => {
  const navigate = useNavigation();
  const navigateTo = node.props?.navigateTo as string | undefined;
  const title = (node.props?.title as string) || 'App';
  const subtitle = (node.props?.subtitle as string);
  const large = node.props?.size === 'large';
  const medium = node.props?.size === 'medium';
  const transparent = node.props?.transparent === true;
  const outline = node.props?.outline as boolean | undefined;
  const centerTitle = node.props?.centerTitle as boolean | undefined;
  const backButton = node.props?.backButton === true;
  const backText = node.props?.backText as string | undefined;
  const rightText = node.props?.rightText as string | undefined;

  // Split children into right-slot items and subnavbar items based on node type
  const childArray = React.Children.toArray(children);
  const nodeChildren = node.children || [];
  const rightChildren: React.ReactNode[] = [];
  const subnavbarChildren: React.ReactNode[] = [];

  if (nodeChildren.length > 0) {
    nodeChildren.forEach((childNode, i) => {
      if (i < childArray.length) {
        if (SUBNAVBAR_TYPES.has(childNode.type)) {
          subnavbarChildren.push(childArray[i]);
        } else {
          rightChildren.push(childArray[i]);
        }
      }
    });
  } else {
    // No node.children metadata — treat all React children as right-slot
    rightChildren.push(...childArray);
  }

  const hasRight = rightChildren.length > 0 || rightText;
  const hasSubnavbar = subnavbarChildren.length > 0;

  return (
    <Navbar
      title={title}
      subtitle={subtitle}
      large={large}
      medium={medium}
      transparent={transparent}
      outline={outline}
      centerTitle={centerTitle}
      left={backButton ? <NavbarBackLink text={backText} onClick={navigateTo && navigate ? () => navigate(navigateTo) : undefined} /> : undefined}
      right={hasRight ? (
        <div className="flex gap-2">
          {rightText && <Link>{rightText}</Link>}
          {rightChildren}
        </div>
      ) : undefined}
      subnavbar={hasSubnavbar ? <>{subnavbarChildren}</> : undefined}
      className="!relative"
    />
  );
};

KNavbar.displayName = 'KNavbar';

export default KNavbar;
