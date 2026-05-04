import { useEffect, useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const lightColors = {
  background: '#E9ECE4',
  panel: '#DDE4D5',
  surface: '#F3F1E7',
  border: '#243B53',
  text: '#243B53',
  muted: '#6E7F73',
  blue: '#7EA6E0',
  grid: '#B7C7B0',
  red: '#D97B6C',
};

const darkColors = {
  background: '#151C22',
  panel: '#2A3741',
  surface: '#1F2A32',
  border: '#9DB2C0',
  text: '#F3F1E7',
  muted: '#B7C7B0',
  blue: '#8FB7EE',
  grid: '#6E7F73',
  red: '#E08A7B',
};

const Couleurs = lightColors;

export type ParametresApplication = {
  darkMode: boolean;
  language: string;
  notifications: boolean;
};

type SettingsPanelProps = {
  open: boolean;
  onClose: () => void;
  settings: ParametresApplication;
  onSave: (settings: ParametresApplication) => void;
};

export default function PanneauParametres({
  open,
  onClose,
  settings,
  onSave,
}: SettingsPanelProps) {
  const [localSettings, setLocalSettings] = useState(settings);
  const themeActif = localSettings.darkMode ? darkColors : lightColors;

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  function saveAndClose() {
    onSave(localSettings);
    onClose();
  }

  function chooseLanguage(language: string) {
    setLocalSettings({ ...localSettings, language });
  }

  function resetData() {
    onClose();
  }

  return (
    <Modal transparent visible={open} animationType="slide">
      <View style={[styles.overlay, { backgroundColor: `${themeActif.border}55` }]}>
        <Pressable style={styles.closeZone} onPress={onClose} />

        <View
          style={[
            styles.panel,
            {
              backgroundColor: themeActif.surface,
              borderRightColor: `${themeActif.border}40`,
            },
          ]}
        >
          {/* Header */}
          <View style={[styles.header, { borderBottomColor: `${themeActif.border}20` }]}>
            <Text style={[styles.title, { color: themeActif.text }]}>Parametres</Text>
            <Pressable onPress={onClose} style={styles.iconButton}>
              <MaterialIcons name="close" size={24} color={themeActif.muted} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <Text style={[styles.sectionTitle, { color: themeActif.muted }]}>Apparence</Text>
            <ToggleRow
              icon={localSettings.darkMode ? 'dark-mode' : 'light-mode'}
              label="Mode sombre"
              description="Change le themeActif de l'interface"
              themeActif={themeActif}
              value={localSettings.darkMode}
              onValueChange={(darkMode) =>
                setLocalSettings({ ...localSettings, darkMode })
              }
            />

            <Text style={[styles.sectionTitle, { color: themeActif.muted }]}>Notifications</Text>
            <ToggleRow
              icon="notifications"
              label="Rappels d'apprentissage"
              description="Active ou desactive les rappels"
              themeActif={themeActif}
              value={localSettings.notifications}
              onValueChange={(notifications) =>
                setLocalSettings({ ...localSettings, notifications })
              }
            />

            <Text style={[styles.sectionTitle, { color: themeActif.muted }]}>Langue</Text>
            <View style={styles.languageRow}>
              {['fr', 'en', 'ar'].map((language) => (
                <Pressable
                  key={language}
                  onPress={() => chooseLanguage(language)}
                  style={[
                    styles.languageButton,
                    {
                      backgroundColor: themeActif.panel,
                      borderColor: `${themeActif.border}25`,
                    },
                    localSettings.language === language && {
                      backgroundColor: themeActif.blue,
                      borderColor: themeActif.blue,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.languageText,
                      { color: themeActif.text },
                      localSettings.language === language && styles.languageTextSelected,
                    ]}
                  >
                    {language.toUpperCase()}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Text style={[styles.sectionTitle, { color: themeActif.red }]}>
              Zone dangereuse
            </Text>
            <Pressable
              onPress={resetData}
              style={[styles.dangerButton, { borderColor: `${themeActif.red}70` }]}
            >
              <MaterialIcons name="delete-outline" size={20} color={themeActif.red} />
              <Text style={[styles.dangerText, { color: themeActif.red }]}>
                Reinitialiser les donnees
              </Text>
            </Pressable>
          </View>

          <View style={[styles.footer, { borderTopColor: `${themeActif.border}20` }]}>
            <Pressable
              onPress={saveAndClose}
              style={[styles.saveButton, { backgroundColor: themeActif.blue }]}
            >
              <Text style={styles.saveText}>Enregistrer</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

type ToggleRowProps = {
  icon: keyof typeof MaterialIcons.glyphMap;
  label: string;
  description: string;
  themeActif: typeof lightColors;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

function ToggleRow({
  icon,
  label,
  description,
  themeActif,
  value,
  onValueChange,
}: ToggleRowProps) {
  return (
    <View style={styles.toggleRow}>
      <MaterialIcons name={icon} size={20} color={themeActif.muted} />

      <View style={styles.toggleTextBox}>
        <Text style={[styles.toggleLabel, { color: themeActif.text }]}>{label}</Text>
        <Text style={[styles.toggleDescription, { color: themeActif.muted }]}>
          {description}
        </Text>
      </View>

      <Pressable
        onPress={() => onValueChange(!value)}
        style={[
          styles.toggleSlider,
          {
            backgroundColor: themeActif.surface,
            borderColor: themeActif.border,
          },
        ]}
      >
        {value && <View style={[styles.toggleFill, { backgroundColor: themeActif.grid }]} />}
        <View
          style={[
            styles.toggleThumb,
            {
              backgroundColor: themeActif.text,
              borderColor: themeActif.panel,
            },
            value ? styles.toggleThumbOn : styles.toggleThumbOff,
          ]}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    backgroundColor: '#243B5355',
    flex: 1,
    flexDirection: 'row',
  },
  closeZone: {
    flex: 1,
  },
  panel: {
    backgroundColor: Couleurs.surface,
    borderRightColor: '#243B5340',
    borderRightWidth: 1,
    maxWidth: 360,
    width: '86%',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: '#243B5320',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 18,
  },
  title: {
    color: Couleurs.text,
    fontSize: 20,
    fontWeight: '900',
  },
  iconButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    gap: 12,
    padding: 18,
  },
  sectionTitle: {
    color: Couleurs.muted,
    fontSize: 12,
    fontWeight: '900',
    marginTop: 8,
    textTransform: 'uppercase',
  },
  toggleRow: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 10,
  },
  toggleTextBox: {
    flex: 1,
  },
  toggleLabel: {
    color: Couleurs.text,
    fontSize: 14,
    fontWeight: '800',
  },
  toggleDescription: {
    color: Couleurs.muted,
    fontSize: 12,
    marginTop: 2,
  },
  toggleSlider: {
    backgroundColor: Couleurs.surface,
    borderColor: Couleurs.border,
    borderRadius: 999,
    borderWidth: 1.5,
    height: 30,
    justifyContent: 'center',
    overflow: 'hidden',
    width: 60,
  },
  toggleFill: {
    backgroundColor: Couleurs.grid,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  toggleThumb: {
    backgroundColor: Couleurs.text,
    borderColor: Couleurs.panel,
    borderRadius: 9,
    borderWidth: 2,
    height: 18,
    position: 'absolute',
    width: 18,
  },
  toggleThumbOff: {
    left: 6,
  },
  toggleThumbOn: {
    right: 6,
  },
  languageRow: {
    flexDirection: 'row',
    gap: 9,
  },
  languageButton: {
    backgroundColor: Couleurs.panel,
    borderColor: '#243B5325',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  languageSelected: {
    backgroundColor: Couleurs.blue,
    borderColor: Couleurs.blue,
  },
  languageText: {
    color: Couleurs.text,
    fontWeight: '800',
  },
  languageTextSelected: {
    color: 'white',
  },
  dangerTitle: {
    color: Couleurs.red,
  },
  dangerButton: {
    alignItems: 'center',
    borderColor: '#D97B6C70',
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    padding: 12,
  },
  dangerText: {
    color: Couleurs.red,
    fontWeight: '700',
  },
  footer: {
    borderTopColor: '#243B5320',
    borderTopWidth: 1,
    padding: 18,
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: Couleurs.blue,
    borderRadius: 8,
    padding: 13,
  },
  saveText: {
    color: 'white',
    fontWeight: '900',
  },
});
