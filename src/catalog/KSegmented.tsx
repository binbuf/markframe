import { type FC } from 'react';
import { Segmented, SegmentedButton } from 'konsta/react';
import type { ComponentProps } from './index';

const KSegmented: FC<ComponentProps> = ({ node }) => {
  const options = (node.props?.options as string[]) || ['Option 1', 'Option 2', 'Option 3'];
  const icons = node.props?.icons as string[] | undefined;
  const activeIndex = (node.props?.active as number) ?? (node.props?.activeIndex as number) ?? 0;
  const strong = node.props?.strong === true;
  const raised = node.props?.raised === true;
  const outline = node.props?.outline === true;
  const rounded = node.props?.rounded === true;
  const fill = node.props?.fill === true;
  const mt = node.props?.mt as number | undefined;
  const mb = node.props?.mb as number | undefined;
  const width = node.props?.width as string | number | undefined;
  const className = (node.props?.className as string) || '';

  // Only apply default margins when className doesn't provide its own
  const hasCustomMx = /\bmx-/.test(className);
  const hasCustomMy = /\bmy-/.test(className) || /\bmt-/.test(className) || /\bmb-/.test(className);

  const wrapperClasses: string[] = [];
  if (!hasCustomMx) wrapperClasses.push('mx-4');
  if (mt !== undefined) {
    wrapperClasses.push(`!mt-${mt}`);
    if (mb !== undefined) wrapperClasses.push(`!mb-${mb}`);
    else wrapperClasses.push('mb-4');
  } else if (mb !== undefined) {
    wrapperClasses.push(`!mb-${mb}`, 'mt-4');
  } else if (!hasCustomMy) {
    wrapperClasses.push('my-4');
  }
  if (fill) wrapperClasses.push('flex-1');
  if (className) wrapperClasses.push(className);

  const style: React.CSSProperties = {};
  if (width !== undefined) style.width = typeof width === 'number' ? `${width}px` : width;

  return (
    <div className={wrapperClasses.join(' ')} style={Object.keys(style).length > 0 ? style : undefined}>
      <Segmented
        strong={strong}
        raised={raised}
        outline={outline}
        rounded={rounded}
      >
        {options.map((option, index) => (
          <SegmentedButton
            key={index}
            active={index === activeIndex}
          >
            {icons && icons[index] ? (
              <ion-icon name={icons[index]} style={{ fontSize: '20px' }} />
            ) : (
              option
            )}
          </SegmentedButton>
        ))}
      </Segmented>
    </div>
  );
};

KSegmented.displayName = 'KSegmented';

export default KSegmented;
