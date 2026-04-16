declare module 'react-native-math-view' {
  import { ComponentType, ReactNode } from 'react';

  type MathViewProps = {
    math: string;
    renderError?: (props: { error: string }) => ReactNode;
  };

  const MathView: ComponentType<MathViewProps>;
  export default MathView;
}
