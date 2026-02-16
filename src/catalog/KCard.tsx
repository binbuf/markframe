import { type FC } from 'react';
import { Card } from 'konsta/react';
import type { ComponentProps } from './index';
import { resolveColor } from './colorUtils';
import { useNavigateOrOverlay } from './useNavigateOrOverlay';

const KCard: FC<ComponentProps> = ({ node, children }) => {
  const handleNavigation = useNavigateOrOverlay();
  const navigateTo = node.props?.navigateTo as string | undefined;
  const title = (node.props?.title as string) || '';
  const content = (node.props?.content as string);
  const footer = (node.props?.footer as string);
  const outline = node.props?.outline !== false;
  const raised = node.props?.raised === true;
  const headerDivider = node.props?.headerDivider === true;
  const footerDivider = node.props?.footerDivider === true;
  const align = (node.props?.align as string) || '';
  const justify = (node.props?.justify as string) || '';
  const className = (node.props?.className as string) || '';

  // New enriched props
  const flush = node.props?.flush === true;
  const width = node.props?.width as number | undefined;
  const shrink = node.props?.shrink;
  const bg = node.props?.bg as string | undefined;

  const alignClass: Record<string, string> = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyClass: Record<string, string> = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  const mt = node.props?.mt as number | undefined;
  const mb = node.props?.mb as number | undefined;

  // Build enriched classes
  const enriched: string[] = [];
  if (flush) enriched.push('!p-0', 'overflow-hidden');
  if (shrink === false) enriched.push('shrink-0');
  const enrichedClass = enriched.join(' ');

  const flexClasses = (align || justify) ? `flex flex-col ${alignClass[align] || ''} ${justifyClass[justify] || ''}` : '';

  const style: React.CSSProperties = {};
  if (bg) style.backgroundColor = resolveColor(bg);
  if (width !== undefined) style.width = `${width}px`;
  // Use inline styles for dynamic margin values (prevents Tailwind JIT issues)
  // Values are in Tailwind spacing scale (1 unit = 0.25rem)
  if (mt !== undefined) style.marginTop = `${mt * 0.25}rem`;
  if (mb !== undefined) style.marginBottom = `${mb * 0.25}rem`;

  if (navigateTo) style.cursor = 'pointer';

  return (
    <Card
      header={title || undefined}
      footer={footer || undefined}
      outline={outline}
      raised={raised}
      headerDivider={headerDivider}
      footerDivider={footerDivider}
      className={`my-4 ${enrichedClass} ${className}`}
      style={style}
      onClick={navigateTo ? () => handleNavigation(navigateTo) : undefined}
    >
      {content ? (
        <div className={`text-sm ${flexClasses}`}>{content}</div>
      ) : (
        <div className={flexClasses}>{children}</div>
      )}
    </Card>
  );
};

KCard.displayName = 'KCard';

export default KCard;
