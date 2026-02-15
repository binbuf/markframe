import { type FC } from 'react';
import { Breadcrumbs, BreadcrumbsItem, BreadcrumbsSeparator } from 'konsta/react';
import type { ComponentProps } from './index';

const KBreadcrumbs: FC<ComponentProps> = ({ node }) => {
  const className = (node.props?.className as string) || '';

  // BreadcrumbsItem is KNoop in catalog, so we map node.children directly
  // (same pattern as KTabs/KDialog for child component types)
  const items = (node.children || []).filter(c => c.type === 'BreadcrumbsItem');

  return (
    <Breadcrumbs className={className}>
      {items.map((childNode, index) => {
        const label = (childNode.props?.label as string) || '';
        const active = childNode.props?.active === true;

        return (
          <span key={childNode.id} className="contents">
            <BreadcrumbsItem active={active}>
              {label}
            </BreadcrumbsItem>
            {index < items.length - 1 && <BreadcrumbsSeparator />}
          </span>
        );
      })}
    </Breadcrumbs>
  );
};

KBreadcrumbs.displayName = 'KBreadcrumbs';

export default KBreadcrumbs;
