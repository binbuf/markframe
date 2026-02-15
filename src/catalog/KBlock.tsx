import { type FC } from 'react';
import { Block, BlockTitle, BlockHeader, BlockFooter } from 'konsta/react';
import type { ComponentProps } from './index';
import { resolveColor } from './colorUtils';

const KBlock: FC<ComponentProps> = ({ node, children }) => {
  const variant = (node.props?.variant as string) || 'block';
  const text = node.props?.text as string;
  const strong = node.props?.strong === true;
  const inset = node.props?.inset === true;
  const align = node.props?.align as string;
  const justify = node.props?.justify as string;
  const className = (node.props?.className as string) || '';

  // New enriched props
  const bg = node.props?.bg as string | undefined;
  const p = node.props?.p as number | undefined;
  const px = node.props?.px as number | undefined;
  const py = node.props?.py as number | undefined;
  const pt = node.props?.pt as number | undefined;
  const pb = node.props?.pb as number | undefined;
  const pl = node.props?.pl as number | undefined;
  const pr = node.props?.pr as number | undefined;
  const mx = node.props?.mx as number | undefined;
  const flush = node.props?.flush === true;
  const rounded = node.props?.rounded === true;
  const border = node.props?.border === true;
  const fill = node.props?.fill === true;
  const mt = node.props?.mt as number | undefined;
  const mb = node.props?.mb as number | undefined;
  const borderTop = node.props?.borderTop === true;
  const borderBottom = node.props?.borderBottom === true;
  const width = node.props?.width as string | number | undefined;
  const height = node.props?.height as string | number | undefined;

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

  // Build enriched classes
  const enriched: string[] = [];
  // Note: bg is handled via inline styles to support dynamic Tailwind colors
  if (p !== undefined) enriched.push(`!p-${p}`);
  if (px !== undefined) enriched.push(`!px-${px}`);
  if (py !== undefined) enriched.push(`!py-${py}`);
  if (pt !== undefined) enriched.push(`!pt-${pt}`);
  if (pb !== undefined) enriched.push(`!pb-${pb}`);
  if (pl !== undefined) enriched.push(`!pl-${pl}`);
  if (pr !== undefined) enriched.push(`!pr-${pr}`);
  if (mx !== undefined) enriched.push(`!mx-${mx}`);
  if (flush) enriched.push('!p-0', '!m-0');
  if (rounded) enriched.push('rounded-lg');
  if (border) enriched.push('border');
  if (fill) enriched.push('flex-1');
  if (borderTop) enriched.push('border-t');
  if (borderBottom) enriched.push('border-b');
  const enrichedClass = enriched.join(' ');

  // Build inline styles
  const style: React.CSSProperties = {};
  if (bg) style.backgroundColor = resolveColor(bg);
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height !== undefined) style.height = typeof height === 'number' ? `${height}px` : height;
  // Use inline styles for dynamic margin values (prevents Tailwind JIT issues)
  // Values are in Tailwind spacing scale (1 unit = 0.25rem)
  if (mt !== undefined) style.marginTop = `${mt * 0.25}rem`;
  if (mb !== undefined) style.marginBottom = `${mb * 0.25}rem`;

  const flexClasses = (align || justify) ? `flex flex-col ${alignClass[align || ''] || ''} ${justifyClass[justify || ''] || ''}` : '';
  const finalClassName = `${flexClasses} ${enrichedClass} ${className}`.trim();

  if (variant === 'title') {
    return (
      <BlockTitle
        medium={!strong}
        large={strong}
        className={`${finalClassName} ${!className.includes('mt-') ? 'mt-6' : ''} ${!className.includes('mb-') ? 'mb-2' : ''}`}
      >
        {text || children}
      </BlockTitle>
    );
  }

  if (variant === 'header') {
    return <BlockHeader className={finalClassName}>{text || children}</BlockHeader>;
  }

  if (variant === 'footer') {
    return <BlockFooter className={finalClassName}>{text || children}</BlockFooter>;
  }

  return (
    <Block strong={strong} inset={inset} className={finalClassName} style={Object.keys(style).length > 0 ? style : undefined}>
      {children}
    </Block>
  );
};

KBlock.displayName = 'KBlock';

export default KBlock;
