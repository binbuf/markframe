import { type FC } from 'react';
import { Button } from 'konsta/react';
import type { ComponentProps } from './index';
import { useNavigateOrOverlay } from './useNavigateOrOverlay';

// Static color map for button colors
const colorClasses: Record<string, { fillBgIos?: string; fillBgMaterial?: string; fillTextIos?: string; fillTextMaterial?: string }> = {
  red: { fillBgIos: 'bg-red-500 active:bg-red-600', fillBgMaterial: 'bg-red-500 active:bg-red-600', fillTextIos: 'text-white', fillTextMaterial: 'text-white' },
  green: { fillBgIos: 'bg-green-500 active:bg-green-600', fillBgMaterial: 'bg-green-500 active:bg-green-600', fillTextIos: 'text-white', fillTextMaterial: 'text-white' },
};

const KButton: FC<ComponentProps> = ({ node, children }) => {
  const handleNavigation = useNavigateOrOverlay();
  const navigateTo = node.props?.navigateTo as string | undefined;
  const label = (node.props?.label as string);
  const outline = node.props?.variant === 'outline';
  const clear = node.props?.variant === 'clear';
  const tonal = node.props?.variant === 'tonal';
  const large = node.props?.large === true || node.props?.size === 'large';
  const small = node.props?.small === true || node.props?.size === 'small';
  const rounded = node.props?.rounded !== false;
  const disabled = node.props?.disabled === true;
  const raised = node.props?.raised === true;
  const inline = node.props?.inline === true;

  // Map color prop to Konsta color classes
  const color = node.props?.color as string | undefined;
  const colors = color && colorClasses[color] ? colorClasses[color] : undefined;

  const fillProp = node.props?.fill === true;
  const push = node.props?.push === true;
  const mt = node.props?.mt as number | undefined;
  const mb = node.props?.mb as number | undefined;

  const btn = (
    <Button
      id={node.props?.id as string}
      outline={outline}
      clear={clear}
      tonal={tonal}
      large={large}
      small={small}
      rounded={rounded}
      disabled={disabled}
      raised={raised}
      inline={inline}
      colors={colors}
      onClick={() => handleNavigation(navigateTo)}
    >
      {label || children}
    </Button>
  );

  if (inline) {
    return btn;
  }

  const wrapperClasses: string[] = ['px-4', 'my-2'];
  if (fillProp) wrapperClasses.push('flex-1');
  if (push) wrapperClasses.push('ml-auto');

  // Build inline styles (use for dynamic margin values to prevent Tailwind JIT issues)
  // Values are in Tailwind spacing scale (1 unit = 0.25rem)
  const wrapperStyle: React.CSSProperties = {};
  if (mt !== undefined) wrapperStyle.marginTop = `${mt * 0.25}rem`;
  if (mb !== undefined) wrapperStyle.marginBottom = `${mb * 0.25}rem`;

  return (
    <div className={wrapperClasses.join(' ')} style={wrapperStyle}>
      {btn}
    </div>
  );
};

KButton.displayName = 'KButton';

export default KButton;
