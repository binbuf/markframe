import { type FC } from 'react';
import type { ComponentProps } from './index';
import { resolveImage } from '../utils/smartAssets';

/**
 * Sanitize image src to prevent XSS attacks.
 * Blocks dangerous protocols like javascript:, data:text/html, etc.
 * Allows: http(s), data:image/, and relative paths.
 */
function sanitizeSrc(src: string): string {
  const trimmed = src.trim();
  if (/^(https?:|data:image\/|\/)/i.test(trimmed)) return trimmed;
  // Block javascript:, data:text/html, and other dangerous protocols
  return '';
}

// Static lookup maps for image styling
const fitMap: Record<string, string> = {
  cover: 'object-cover',
  contain: 'object-contain',
  fill: 'object-fill'
};

const ratioMap: Record<string, string> = {
  square: 'aspect-square',
  video: 'aspect-video'
};

const KImage: FC<ComponentProps> = ({ node }) => {
  const resolvedSrc = resolveImage(node.props?.src as string, node.id) || '';
  const src = sanitizeSrc(resolvedSrc);
  const alt = (node.props?.alt as string) || '';
  const size = node.props?.size as number | undefined;
  const width = size ?? (node.props?.width as number | undefined);
  const height = size ?? (node.props?.height as number | undefined);
  const className = (node.props?.className as string) || '';

  // New enriched props
  const circle = node.props?.circle === true;
  const rounded = node.props?.rounded === true;
  const fit = node.props?.fit as string | undefined;
  const ratio = node.props?.ratio as string | undefined;
  const border = node.props?.border as string | undefined;

  const mt = node.props?.mt as number | undefined;
  const mb = node.props?.mb as number | undefined;

  // Build classes from enriched props
  const enrichedClasses: string[] = [];

  if (circle) {
    enrichedClasses.push('rounded-full', 'aspect-square', 'object-cover', 'shrink-0');
  }
  if (rounded) {
    enrichedClasses.push('rounded-lg');
  }
  if (fit) {
    if (fitMap[fit]) enrichedClasses.push(fitMap[fit]);
  }
  if (ratio) {
    if (ratioMap[ratio]) enrichedClasses.push(ratioMap[ratio]);
    else enrichedClasses.push(`aspect-[${ratio}]`);
  }
  if (border) {
    const noSuffix = ['white', 'black', 'transparent'];
    enrichedClasses.push('border-2', noSuffix.includes(border) ? `border-${border}` : `border-${border}-500`);
  }

  // Determine if we should force full width
  const hasWidthProp = width !== undefined;
  const hasWidthClass = /\bw-/.test(className);

  const widthClass = (hasWidthProp || hasWidthClass) ? '' : 'w-full';
  const finalClassName = `${widthClass} ${enrichedClasses.join(' ')} ${className}`.trim();

  // Build inline styles (use for dynamic margin values to prevent Tailwind JIT issues)
  // Values are in Tailwind spacing scale (1 unit = 0.25rem)
  const style: React.CSSProperties = { display: 'block' };
  if (mt !== undefined) style.marginTop = `${mt * 0.25}rem`;
  if (mb !== undefined) style.marginBottom = `${mb * 0.25}rem`;

  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={finalClassName}
      style={style}
    />
  );
};

KImage.displayName = 'KImage';

export default KImage;
