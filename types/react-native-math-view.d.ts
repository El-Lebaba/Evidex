declare module 'react-native-mathematiques-view' {
  import { ComponentType, ReactNode } from 'react';

  type MathViewProps = {
    mathematiques: string;
    renderError?: (props: { error: string }) => ReactNode;
  };

  const MathView: ComponentType<MathViewProps>;
  export default MathView;
}
