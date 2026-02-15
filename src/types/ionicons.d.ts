import type { CSSProperties } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'ion-icon': {
        name: string;
        style?: CSSProperties;
        class?: string;
        size?: string;
      };
    }
  }
}
