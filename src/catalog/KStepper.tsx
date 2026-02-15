import { type FC } from 'react';
import { Stepper } from 'konsta/react';
import type { ComponentProps } from './index';

const KStepper: FC<ComponentProps> = ({ node }) => {
  const value = (node.props?.value as number) ?? 0;
  const input = node.props?.input === true;
  const rounded = node.props?.rounded === true;
  const small = node.props?.small === true;
  const large = node.props?.large === true;
  const raised = node.props?.raised === true;
  const outline = node.props?.outline === true;
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
      <Stepper
        value={value}
        input={input}
        rounded={rounded}
        small={small}
        large={large}
        raised={raised}
        outline={outline}
      />
    </div>
  );
};

KStepper.displayName = 'KStepper';

export default KStepper;
