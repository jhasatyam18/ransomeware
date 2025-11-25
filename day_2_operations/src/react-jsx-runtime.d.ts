declare module 'react/jsx-runtime' {
    export * from 'react';
}
import * as React from 'react'

declare global {
  namespace JSX {
    interface IntrinsicElements {
      item: React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;
    }
  }
}