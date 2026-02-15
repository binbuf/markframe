import { type FC } from 'react';
import { Range } from 'konsta/react';
import type { ComponentProps } from './index';

const KRange: FC<ComponentProps> = ({ node }) => {
  const value = (node.props?.value as number) ?? 50;
  const min = (node.props?.min as number) ?? 0;
  const max = (node.props?.max as number) ?? 100;
  const step = (node.props?.step as number) ?? 1;
  const disabled = node.props?.disabled === true;
  const label = node.props?.label as string | undefined;
  const fill = node.props?.fill === true;
  const mt = node.props?.mt as number | undefined;
  const mb = node.props?.mb as number | undefined;
  const className = (node.props?.className as string) || '';

  const wrapperClasses = ['mx-4', 'my-2'];
  if (fill) wrapperClasses.push('flex-1');
  if (mt !== undefined) wrapperClasses.push(`!mt-${mt}`);
  if (mb !== undefined) wrapperClasses.push(`!mb-${mb}`);
  if (className) wrapperClasses.push(className);

  return (
    <div className={wrapperClasses.join(' ')}>
      {label && <div className="text-xs text-gray-500 mb-1">{label}</div>}
      <Range
        value={value}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
      />
    </div>
  );
};

KRange.displayName = 'KRange';

export default KRange;
