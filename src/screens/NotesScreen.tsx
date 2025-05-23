import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  SafeAreaView,
  Appearance,
  Alert,
  useColorScheme,
} from 'react-native';
import {Colors} from '../utils/Theme';
import Icon from '@react-native-vector-icons/ionicons';
import {heightPercentageToDP, widthPercentageToDP} from '../utils/ScreenSize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NOTES_KEY = 'NOTES_DATA';
const colorScheme = Appearance.getColorScheme() || 'light';

type Note = {
  id: string;
  title: string;
  content: string;
};

const NotesScreen = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const [notes, setNotes] = useState<Note[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isEdit, setIsEdit] = useState(false);

  // Load notes from AsyncStorage on mount
  useEffect(() => {
    (async () => {
      try {
        const storedNotes = await AsyncStorage.getItem(NOTES_KEY);
        if (storedNotes) setNotes(JSON.parse(storedNotes));
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(NOTES_KEY, JSON.stringify(notes));
  }, [notes]);

  const openAddModal = () => {
    setTitle('');
    setContent('');
    setModalVisible(true);
    setSelectedNote(null);
    setIsEdit(false);
  };

  const openEditModal = (note: Note) => {
    setTitle(note.title);
    setContent(note.content);
    setModalVisible(true);
    setSelectedNote(note);
    setIsEdit(true);
  };

  const addOrEditNote = () => {
    if (title.trim() && content.trim()) {
      if (isEdit && selectedNote) {
        setNotes(
          notes.map(n =>
            n.id === selectedNote.id ? {...n, title, content} : n,
          ),
        );
      } else {
        setNotes([
          ...notes,
          {
            id: Date.now().toString(),
            title,
            content,
          },
        ]);
      }
      setModalVisible(false);
      setTitle('');
      setContent('');
      setIsEdit(false);
      setSelectedNote(null);
    }
  };

  const deleteNote = (id: string) => {
    Alert.alert('Delete Note', 'Are you sure you want to delete this note?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => setNotes(notes.filter(n => n.id !== id)),
      },
    ]);
  };

  const renderNote = ({item}: {item: Note}) => (
    <TouchableOpacity
      style={styles.noteCard}
      activeOpacity={0.8}
      onPress={() => setSelectedNote(item)}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <TouchableOpacity onPress={() => openEditModal(item)}>
          <Icon
            name="create-outline"
            size={22}
            color={Colors[colorScheme].subTextColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteNote(item.id)}
          style={{marginLeft: 10}}>
          <Icon name="trash-outline" size={22} color="#e57373" />
        </TouchableOpacity>
      </View>
      <Text style={styles.noteContent} numberOfLines={2}>
        {item.content}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: Colors[colorScheme ?? 'light'].backgroundColor},
      ]}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Notes</Text>
        <TouchableOpacity style={styles.addButton} onPress={openAddModal}>
          <Icon
            name="add-circle"
            size={36}
            color={Colors[colorScheme ?? 'light'].subTextColor}
          />
        </TouchableOpacity>
      </View>
      <FlatList
        data={notes}
        keyExtractor={item => item.id}
        renderItem={renderNote}
        contentContainerStyle={{paddingBottom: 20}}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No notes yet. Tap + to add one!</Text>
        }
      />

      {/* Add/Edit Note Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: Colors[colorScheme ?? 'light'].subContainer},
            ]}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Edit Note' : 'Add Note'}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: Colors[colorScheme].subTextColor,
                  color: Colors[colorScheme].textColor,
                  backgroundColor: Colors[colorScheme].backgroundColor,
                },
              ]}
              placeholder="Title"
              placeholderTextColor={
                Colors[colorScheme ?? 'light'].textColor + '99'
              }
              value={title}
              onChangeText={setTitle}
            />
            <TextInput
              style={[
                styles.input,
                {
                  height: 80,
                  borderColor: Colors[colorScheme].subTextColor,
                  color: Colors[colorScheme].textColor,
                  backgroundColor: Colors[colorScheme].backgroundColor,
                },
              ]}
              placeholder="Content"
              placeholderTextColor={
                Colors[colorScheme ?? 'light'].textColor + '99'
              }
              value={content}
              onChangeText={setContent}
              multiline
            />
            <View style={styles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addOrEditNote}>
                <Text
                  style={[
                    styles.saveText,
                    {color: Colors[colorScheme ?? 'light'].subTextColor},
                  ]}>
                  {isEdit ? 'Update' : 'Save'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* View Note Modal */}
      <Modal
        visible={!!selectedNote && !isEdit}
        animationType="fade"
        transparent
        onRequestClose={() => setSelectedNote(null)}>
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              {backgroundColor: Colors[colorScheme ?? 'light'].subContainer},
            ]}>
            <Text style={styles.modalTitle}>{selectedNote?.title}</Text>
            <Text
              style={[
                styles.fullContent,
                {color: Colors[colorScheme ?? 'light'].textColor},
              ]}>
              {selectedNote?.content}
            </Text>
            <TouchableOpacity
              style={{alignSelf: 'flex-end'}}
              onPress={() => setSelectedNote(null)}>
              <Text
                style={[
                  styles.closeText,
                  {color: Colors[colorScheme ?? 'light'].subTextColor},
                ]}>
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NotesScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: widthPercentageToDP(5),
    paddingTop: heightPercentageToDP(3),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentageToDP(2),
    justifyContent: 'space-between',
  },
  headerText: {
    fontSize: heightPercentageToDP(3),
    fontWeight: 'bold',
    paddingLeft: widthPercentageToDP(5),
    color: Colors[colorScheme].textColor,
  },
  addButton: {
    marginLeft: widthPercentageToDP(2),
  },
  noteCard: {
    backgroundColor: Colors[colorScheme].subContainer,
    borderRadius: widthPercentageToDP(4),
    padding: widthPercentageToDP(4),
    marginBottom: heightPercentageToDP(2),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: widthPercentageToDP(2),
    elevation: 2,
  },
  noteTitle: {
    fontSize: heightPercentageToDP(2.2),
    fontWeight: 'bold',
    color: Colors[colorScheme].subTextColor,
    marginBottom: heightPercentageToDP(0.5),
  },
  noteContent: {
    fontSize: heightPercentageToDP(1.8),
    color: Colors[colorScheme].textColor,
    opacity: 0.8,
  },
  emptyText: {
    textAlign: 'center',
    color: Colors[colorScheme].textColor,
    opacity: 0.5,
    marginTop: heightPercentageToDP(10),
    fontSize: heightPercentageToDP(2),
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: '#00000088',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: widthPercentageToDP(85),
    borderRadius: widthPercentageToDP(5),
    padding: widthPercentageToDP(5),
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: widthPercentageToDP(3),
    elevation: 5,
  },
  modalTitle: {
    fontSize: heightPercentageToDP(2.5),
    fontWeight: 'bold',
    color: Colors[colorScheme].subTextColor,
    marginBottom: heightPercentageToDP(1.2),
  },
  input: {
    borderWidth: 1,

    borderRadius: widthPercentageToDP(3),
    padding: heightPercentageToDP(1.2),
    marginBottom: heightPercentageToDP(1.5),

    fontSize: heightPercentageToDP(2),
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: widthPercentageToDP(5),
  },
  cancelText: {
    color: '#888',
    fontSize: heightPercentageToDP(2),
    marginRight: widthPercentageToDP(4),
  },
  saveText: {
    fontWeight: 'bold',
    fontSize: heightPercentageToDP(2),
  },
  closeText: {
    fontWeight: 'bold',
    fontSize: heightPercentageToDP(2),
    marginTop: heightPercentageToDP(2),
  },
  fullContent: {
    fontSize: heightPercentageToDP(2),
    marginVertical: heightPercentageToDP(1.2),
  },
});
