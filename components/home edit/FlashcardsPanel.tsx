import { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

const colors = {
  background: '#E9ECE4',
  panel: '#DDE4D5',
  surface: '#F3F1E7',
  border: '#243B53',
  text: '#243B53',
  muted: '#6E7F73',
  blue: '#7EA6E0',
  green: '#7CCFBF',
};

const darkColors = {
  background: '#151C22',
  panel: '#2A3741',
  surface: '#1F2A32',
  border: '#9DB2C0',
  text: '#F3F1E7',
  muted: '#B7C7B0',
  blue: '#8FB7EE',
  green: '#7CCFBF',
};

type Flashcard = {
  front: string;
  back: string;
};

const topics = [
  'Java - If Statement',
  'Java - Variables',
  'Java - For Loops',
  'Java - Methods',
  'Java - Arrays',
];

const cardsByTopic: Record<string, Flashcard[]> = {
  'Java - If Statement': [
    {
      front: "C'est quoi un if statement?",
      back: 'Une condition qui execute du code seulement si elle est vraie.',
    },
    {
      front: 'Quelle est la syntaxe de base?',
      back: 'if (condition) { // code }',
    },
    {
      front: 'A quoi sert else?',
      back: 'Else donne un autre bloc de code si la condition est fausse.',
    },
  ],
  'Java - Variables': [
    {
      front: 'Comment declarer un entier?',
      back: 'int nombre = 42;',
    },
    {
      front: "C'est quoi une variable final?",
      back: 'Une valeur qui ne peut plus changer apres son initialisation.',
    },
  ],
};

export default function FlashcardsPanel({ darkMode = false }: { darkMode?: boolean }) {
  const theme = darkMode ? darkColors : colors;
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showBack, setShowBack] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');

  const currentCard = cards[currentIndex];

  function selectTopic(topic: string) {
    const savedCards = cardsByTopic[topic] ?? [
      { front: `Question 1 sur ${topic}`, back: 'Reponse 1' },
      { front: `Question 2 sur ${topic}`, back: 'Reponse 2' },
    ];

    setSelectedTopic(topic);
    setCards(savedCards);
    setCurrentIndex(0);
    setShowBack(false);
  }

  function createCard() {
    if (!newFront.trim() || !newBack.trim()) {
      return;
    }

    setCards([...cards, { front: newFront.trim(), back: newBack.trim() }]);
    setNewFront('');
    setNewBack('');
    setModalOpen(false);
  }

  function changeCard(direction: number) {
    const nextIndex = currentIndex + direction;

    if (nextIndex >= 0 && nextIndex < cards.length) {
      setCurrentIndex(nextIndex);
      setShowBack(false);
    }
  }

  return (
    <View style={styles.container}>
      {/* Panel title and add button */}
      <View style={styles.header}>
        <View>
          <Text style={[styles.title, { color: theme.text }]}>Cartes de revision</Text>
          {selectedTopic && (
            <Text style={[styles.subtitle, { color: theme.muted }]}>{selectedTopic}</Text>
          )}
        </View>

        <Pressable
          onPress={() => setModalOpen(true)}
          style={[styles.addButton, { backgroundColor: theme.blue }]}
        >
          <MaterialIcons name="add" size={17} color="white" />
          <Text style={styles.addButtonText}>Creer</Text>
        </Pressable>
      </View>

      {/* First screen: choose what course the cards are about */}
      {!selectedTopic && (
        <View style={styles.topicList}>
          <Text style={[styles.helpText, { color: theme.muted }]}>
            Selectionne un sujet pour commencer.
          </Text>
          {topics.map((topic) => (
            <Pressable
              key={topic}
              onPress={() => selectTopic(topic)}
              style={[
                styles.topicButton,
                {
                  backgroundColor: theme.panel,
                  borderColor: `${theme.border}25`,
                },
              ]}
            >
              <Text style={[styles.topicText, { color: theme.text }]}>{topic}</Text>
            </Pressable>
          ))}
        </View>
      )}

      {/* Flashcard viewer */}
      {selectedTopic && currentCard && (
        <View style={styles.viewer}>
          <Pressable
            onPress={() => setShowBack(!showBack)}
            style={[
              styles.card,
              {
                backgroundColor: showBack ? theme.background : theme.panel,
                borderColor: showBack ? `${theme.green}80` : `${theme.border}30`,
              },
            ]}
          >
            <MaterialIcons
              name={showBack ? 'check-circle' : 'auto-awesome'}
              size={26}
              color={showBack ? colors.green : colors.blue}
            />
            <Text style={[styles.cardText, { color: theme.text }]}>
              {showBack ? currentCard.back : currentCard.front}
            </Text>
            <Text style={[styles.tapText, { color: theme.muted }]}>
              {showBack ? 'Clique pour revenir' : 'Clique pour voir la reponse'}
            </Text>
          </Pressable>

          <View style={styles.cardControls}>
            <Pressable
              onPress={() => changeCard(-1)}
              disabled={currentIndex === 0}
              style={[
                styles.arrowButton,
                {
                  backgroundColor: theme.panel,
                  borderColor: `${theme.border}25`,
                },
                currentIndex === 0 && styles.disabled,
              ]}
            >
              <MaterialIcons name="chevron-left" size={24} color={theme.text} />
            </Pressable>

            <View style={styles.counterBox}>
              <Text style={[styles.counter, { color: theme.muted }]}>
                {currentIndex + 1}/{cards.length}
              </Text>
              <Pressable
                onPress={() => {
                  setCurrentIndex(0);
                  setShowBack(false);
                }}
              >
                <MaterialIcons name="restart-alt" size={19} color={theme.muted} />
              </Pressable>
            </View>

            <Pressable
              onPress={() => changeCard(1)}
              disabled={currentIndex === cards.length - 1}
              style={[
                styles.arrowButton,
                {
                  backgroundColor: theme.panel,
                  borderColor: `${theme.border}25`,
                },
                currentIndex === cards.length - 1 && styles.disabled,
              ]}
            >
              <MaterialIcons name="chevron-right" size={24} color={theme.text} />
            </Pressable>
          </View>

          <Pressable
            onPress={() => {
              setSelectedTopic(null);
              setCards([]);
            }}
          >
            <Text style={[styles.changeTopic, { color: theme.muted }]}>
              Changer de sujet
            </Text>
          </Pressable>
        </View>
      )}

      {/* Simple modal to add one personal card */}
      <Modal transparent visible={modalOpen} animationType="fade">
        <View style={styles.modalBackground}>
          <View
            style={[
              styles.modalBox,
              {
                backgroundColor: theme.surface,
                borderColor: `${theme.border}40`,
              },
            ]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.title, { color: theme.text }]}>Nouvelle carte</Text>
              <Pressable onPress={() => setModalOpen(false)}>
                <MaterialIcons name="close" size={24} color={theme.muted} />
              </Pressable>
            </View>

            <TextInput
              multiline
              placeholder="Question"
              placeholderTextColor={colors.muted}
              value={newFront}
              onChangeText={setNewFront}
              style={[
                styles.input,
                {
                  backgroundColor: theme.panel,
                  borderColor: `${theme.border}30`,
                  color: theme.text,
                },
              ]}
            />
            <TextInput
              multiline
              placeholder="Reponse"
              placeholderTextColor={colors.muted}
              value={newBack}
              onChangeText={setNewBack}
              style={[
                styles.input,
                {
                  backgroundColor: theme.panel,
                  borderColor: `${theme.border}30`,
                  color: theme.text,
                },
              ]}
            />

            <Pressable
              onPress={createCard}
              style={[styles.saveButton, { backgroundColor: theme.blue }]}
            >
              <Text style={styles.saveText}>Creer la carte</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 14,
  },
  header: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: colors.text,
    fontSize: 17,
    fontWeight: '900',
  },
  subtitle: {
    color: colors.muted,
    fontSize: 12,
    marginTop: 2,
  },
  addButton: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '800',
  },
  topicList: {
    gap: 9,
  },
  helpText: {
    color: colors.muted,
    fontSize: 12,
    marginBottom: 4,
  },
  topicButton: {
    backgroundColor: colors.panel,
    borderColor: '#243B5325',
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  topicText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '700',
  },
  viewer: {
    flex: 1,
    gap: 13,
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: '#243B5330',
    borderRadius: 10,
    borderWidth: 1,
    flex: 1,
    justifyContent: 'center',
    minHeight: 230,
    padding: 22,
  },
  cardBack: {
    backgroundColor: colors.background,
    borderColor: '#7CCFBF80',
  },
  cardText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '800',
    lineHeight: 23,
    marginTop: 14,
    textAlign: 'center',
  },
  tapText: {
    color: colors.muted,
    fontSize: 11,
    marginTop: 14,
  },
  cardControls: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  arrowButton: {
    alignItems: 'center',
    backgroundColor: colors.panel,
    borderColor: '#243B5325',
    borderRadius: 8,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  disabled: {
    opacity: 0.35,
  },
  counterBox: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  counter: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
  changeTopic: {
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
  },
  modalBackground: {
    alignItems: 'center',
    backgroundColor: '#00000055',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalBox: {
    backgroundColor: colors.surface,
    borderColor: '#243B5340',
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
    maxWidth: 420,
    padding: 18,
    width: '100%',
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    backgroundColor: colors.panel,
    borderColor: '#243B5330',
    borderRadius: 8,
    borderWidth: 1,
    color: colors.text,
    minHeight: 82,
    padding: 12,
    textAlignVertical: 'top',
  },
  saveButton: {
    alignItems: 'center',
    backgroundColor: colors.blue,
    borderRadius: 8,
    padding: 12,
  },
  saveText: {
    color: 'white',
    fontWeight: '800',
  },
});
