import { type FC, Fragment } from 'react';
import { BlockTitle } from 'konsta/react';
import type { ComponentProps } from './index';

const KText: FC<ComponentProps> = ({ node, children }) => {
  const text = (node.props?.text as string);
  const isTitle = node.props?.variant === 'title';
  const isHeader = node.props?.variant === 'header';
  const isCaption = node.props?.variant === 'caption';
  const isSubtitle = node.props?.variant === 'subtitle';
  const color = (node.props?.color as string);
  const className = (node.props?.className as string) || '';

  // New enriched props
  const bold = node.props?.bold === true || node.props?.strong === true;
  const semibold = node.props?.semibold === true;
  const size = node.props?.size as string | number | undefined;
  const align = node.props?.align as string | undefined;
  const mono = node.props?.mono === true;

  // Handle color: white/black don't use -500 suffix; shades (blue-100) and opacity (white/60) pass through
  const noSuffixColors = ['white', 'black', 'transparent', 'inherit', 'current'];
  const colorClass = color
    ? ((noSuffixColors.includes(color) || color.includes('-') || color.includes('/'))
      ? `text-${color}` : `text-${color}-500`)
    : '';

  // Build enriched classes
  const enriched: string[] = [];
  if (bold) enriched.push('font-bold');
  if (semibold) enriched.push('font-semibold');
  if (size !== undefined) {
    // Numeric sizes use arbitrary value syntax; named sizes use Tailwind classes
    if (typeof size === 'number') enriched.push(`text-[${size}px]`);
    else enriched.push(`text-${size}`);
  }
  if (align) enriched.push(`text-${align}`);
  if (mono) enriched.push('font-mono');
  const enrichedClass = enriched.join(' ');

  // Helper to render newlines as <br />
  const renderText = (content: string | undefined | React.ReactNode) => {
    if (typeof content !== 'string') return content;
    if (!content.includes('\n')) return content;
    return content.split('\n').map((line, i) => (
      <Fragment key={i}>
        {i > 0 && <br />}
        {line}
      </Fragment>
    ));
  };

  const content = renderText(text || children);

  // Title & Header use Konsta BlockTitle for section-header styling
  if (isTitle) {
    return (
      <BlockTitle className={`${className} ${enrichedClass} ${!className.includes('mt-') ? '!mt-6' : ''} ${!className.includes('mb-') ? '!mb-2' : ''} ${colorClass}`}>
        {content}
      </BlockTitle>
    );
  }

  if (isHeader) {
    return (
      <BlockTitle large className={`${className} ${enrichedClass} ${!className.includes('mt-') ? '!mt-8' : ''} ${!className.includes('mb-') ? '!mb-4' : ''} ${colorClass}`}>
        {content}
      </BlockTitle>
    );
  }

  // Caption, subtitle, and body text use plain <div> for tight stacking
  // (Konsta's <Block> adds my-8, px-safe-4, z-10 relative — too heavy for text labels)
  if (isCaption) {
    return (
      <div className={`text-xs text-gray-500 ${enrichedClass} ${className} ${colorClass}`}>
        {content}
      </div>
    );
  }

  if (isSubtitle) {
    return (
      <div className={`text-sm font-medium ${enrichedClass} ${className} ${colorClass}`}>
        {content}
      </div>
    );
  }

  return (
    <div className={`text-sm ${enrichedClass} ${className} ${colorClass}`}>
      {content}
    </div>
  );
};

KText.displayName = 'KText';

export default KText;
