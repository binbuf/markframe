import { type FC } from 'react';
import { List, ListInput } from 'konsta/react';
import type { ComponentProps } from './index';

const KInput: FC<ComponentProps> = ({ node }) => {
  const label = (node.props?.label as string) || '';
  const placeholder = (node.props?.placeholder as string) || '';
  const type = (node.props?.type as string) || 'text';
  const value = (node.props?.value as string) || '';
  const outline = node.props?.outline !== false;
  const floatingLabel = node.props?.floatingLabel === true;
  const clearButton = node.props?.clearButton === true;
  const error = node.props?.error as string | boolean | undefined;
  const info = node.props?.info as string | undefined;
  const disabled = node.props?.disabled === true;
  const readOnly = node.props?.readOnly === true;
  const required = node.props?.required === true;
  const maxLength = node.props?.maxLength as number | undefined;
  const media = node.props?.media as string | undefined;
  const fill = node.props?.fill === true;
  const mt = node.props?.mt as number | undefined;
  const mb = node.props?.mb as number | undefined;
  const className = (node.props?.className as string) || '';

  const mediaEl = media ? (
    <ion-icon name={media.replace(/^ion-/, '')} style={{ fontSize: '24px' }} />
  ) : undefined;

  const wrapperClasses: string[] = ['my-0'];
  if (fill) wrapperClasses.push('flex-1');
  if (mt !== undefined) wrapperClasses.push(`!mt-${mt}`);
  if (mb !== undefined) wrapperClasses.push(`!mb-${mb}`);
  if (className) wrapperClasses.push(className);

  return (
    <List className={wrapperClasses.join(' ')}>
      <ListInput
        label={label}
        placeholder={placeholder}
        type={type}
        value={value}
        outline={outline}
        floatingLabel={floatingLabel}
        clearButton={clearButton}
        error={error}
        info={info}
        disabled={disabled}
        readOnly={readOnly}
        required={required}
        maxLength={maxLength}
        media={mediaEl}
      />
    </List>
  );
};

KInput.displayName = 'KInput';

export default KInput;
