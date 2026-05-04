import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { TexteTheme } from '@/components/texte-theme';
import { VueTheme } from '@/components/vue-theme';

export default function ModalScreen() {
  return (
    <VueTheme style={styles.container}>
      <TexteTheme type="title">This is a modal</TexteTheme>
      <Link href="/" dismissTo style={styles.link}>
        <TexteTheme type="link">Go to home screen</TexteTheme>
      </Link>
    </VueTheme>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});