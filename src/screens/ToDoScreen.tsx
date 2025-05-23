import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  FlatList,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  useColorScheme, // <-- import useColorScheme
} from 'react-native';
import { Colors } from '../utils/Theme';
import Icon from '@react-native-vector-icons/ionicons';
import { heightPercentageToDP, widthPercentageToDP } from '../utils/ScreenSize';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TODO_KEY = 'TODO_DATA';

type SubTask = {
  id: string;
  text: string;
  completed: boolean;
};

type ToDo = {
  id: string;
  title: string;
  subTasks: SubTask[];
  completed: boolean;
};

const ToDoScreen = () => {
  const colorScheme = useColorScheme() ?? 'light';
  const [toDos, setToDos] = useState<ToDo[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [editToDo, setEditToDo] = useState<ToDo | null>(null);
  const [title, setTitle] = useState('');
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [subTaskInput, setSubTaskInput] = useState('');
  const [showCompleted, setShowCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(TODO_KEY);
        if (stored) setToDos(JSON.parse(stored));
      } catch (e) {}
    })();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem(TODO_KEY, JSON.stringify(toDos));
  }, [toDos]);

  const openAddModal = () => {
    setTitle('');
    setSubTasks([]);
    setEditToDo(null);
    setModalVisible(true);
  };

  const openEditModal = (todo: ToDo) => {
    setTitle(todo.title);
    setSubTasks(todo.subTasks);
    setEditToDo(todo);
    setModalVisible(true);
  };

  const addSubTask = () => {
    if (subTaskInput.trim()) {
      setSubTasks([
        ...subTasks,
        { id: Date.now().toString(), text: subTaskInput, completed: false },
      ]);
      setSubTaskInput('');
    }
  };

  const toggleSubTask = (id: string) => {
    setSubTasks(subTasks.map(st => st.id === id ? { ...st, completed: !st.completed } : st));
  };

  const removeSubTask = (id: string) => {
    setSubTasks(subTasks.filter(st => st.id !== id));
  };

  const saveToDo = () => {
    if (title.trim() && subTasks.length > 0) {
      if (editToDo) {
        setToDos(toDos.map(td =>
          td.id === editToDo.id
            ? { ...td, title, subTasks, completed: subTasks.every(st => st.completed) }
            : td
        ));
      } else {
        setToDos([
          ...toDos,
          {
            id: Date.now().toString(),
            title,
            subTasks,
            completed: false,
          },
        ]);
      }
      setModalVisible(false);
      setTitle('');
      setSubTasks([]);
      setEditToDo(null);
    }
  };

  const toggleToDoComplete = (todo: ToDo) => {
    const updated = toDos.map(td =>
      td.id === todo.id
        ? {
            ...td,
            completed: !td.completed,
            subTasks: td.subTasks.map(st => ({ ...st, completed: !td.completed })),
          }
        : td
    );
    setToDos(updated);
  };

  const deleteToDo = (id: string) => {
    Alert.alert(
      "Delete To-Do",
      "Are you sure you want to delete this to-do?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => setToDos(toDos.filter(td => td.id !== id)),
        },
      ]
    );
  };

  const renderToDo = ({ item }: { item: ToDo }) => (
    <View style={styles(colorScheme).todoCard}>
      <TouchableOpacity onPress={() => toggleToDoComplete(item)}>
        <Icon
          name={item.completed ? "checkbox" : "square-outline"}
          size={26}
          color={item.completed ? Colors[colorScheme].subTextColor : Colors[colorScheme].textColor}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={{ flex: 1, marginLeft: widthPercentageToDP(2) }}
        onPress={() => openEditModal(item)}
        disabled={item.completed}
      >
        <Text style={[
          styles(colorScheme).todoTitle,
          item.completed && { textDecorationLine: 'line-through', opacity: 0.6 }
        ]}>
          {item.title}
        </Text>
        <FlatList
          data={item.subTasks}
          keyExtractor={st => st.id}
          renderItem={({ item: st }) => (
            <Text
              style={[
                styles(colorScheme).subTaskText,
                st.completed && { textDecorationLine: 'line-through', opacity: 0.6 }
              ]}
              numberOfLines={1}
            >
              • {st.text}
            </Text>
          )}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => openEditModal(item)} disabled={item.completed}>
        <Icon name="create-outline" size={22} color={Colors[colorScheme].subTextColor} />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => deleteToDo(item.id)} style={{ marginLeft: widthPercentageToDP(2) }}>
        <Icon name="trash-outline" size={22} color="#e57373" />
      </TouchableOpacity>
    </View>
  );

  const activeToDos = toDos.filter(td => !td.completed);
  const completedToDos = toDos.filter(td => td.completed);

  // Use styles as a function inside the component
  const themedStyles = styles(colorScheme);

  return (
    <SafeAreaView style={[themedStyles.container, { backgroundColor: Colors[colorScheme].backgroundColor }]}>
      <View style={themedStyles.header}>
        <Text style={themedStyles.headerText}>To-Do List</Text>
        <TouchableOpacity style={themedStyles.addButton} onPress={openAddModal}>
          <Icon name="add-circle" size={36} color={Colors[colorScheme].subTextColor} />
        </TouchableOpacity>
      </View>
      <View style={themedStyles.switchSection}>
        <TouchableOpacity onPress={() => setShowCompleted(false)} style={[themedStyles.switchBtn, !showCompleted && themedStyles.activeSwitchBtn]}>
          <Text style={[themedStyles.switchText, !showCompleted && themedStyles.activeSwitchText]}>Active</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowCompleted(true)} style={[themedStyles.switchBtn, showCompleted && themedStyles.activeSwitchBtn]}>
          <Text style={[themedStyles.switchText, showCompleted && themedStyles.activeSwitchText]}>Completed</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={showCompleted ? completedToDos : activeToDos}
        keyExtractor={item => item.id}
        renderItem={renderToDo}
        contentContainerStyle={{ paddingBottom: heightPercentageToDP(2) }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Text style={themedStyles.emptyText}>
            {showCompleted ? "No completed tasks yet." : "No active tasks. Tap + to add one!"}
          </Text>
        }
      />

      {/* Add/Edit Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <KeyboardAvoidingView
          style={themedStyles.modalOverlay}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <View style={[themedStyles.modalContent, { backgroundColor: Colors[colorScheme].subContainer }]}>
            <Text style={themedStyles.modalTitle}>{editToDo ? "Edit To-Do" : "Add To-Do"}</Text>
            <TextInput
              style={themedStyles.input}
              placeholder="To-Do Title"
              placeholderTextColor={Colors[colorScheme].textColor + '99'}
              value={title}
              onChangeText={setTitle}
            />
            <View style={themedStyles.subTaskInputRow}>
              <TextInput
                style={[themedStyles.input, { flex: 1, marginBottom: 0 }]}
                placeholder="Add subtask"
                placeholderTextColor={Colors[colorScheme].textColor + '99'}
                value={subTaskInput}
                onChangeText={setSubTaskInput}
                onSubmitEditing={addSubTask}
              />
              <TouchableOpacity onPress={addSubTask} style={{ marginLeft: widthPercentageToDP(2) }}>
                <Icon name="add" size={28} color={Colors[colorScheme].subTextColor} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: heightPercentageToDP(15), marginBottom: heightPercentageToDP(1.5) }}>
              {subTasks.map(st => (
                <View key={st.id} style={themedStyles.subTaskRow}>
                  <TouchableOpacity onPress={() => toggleSubTask(st.id)}>
                    <Icon
                      name={st.completed ? "checkbox" : "square-outline"}
                      size={22}
                      color={st.completed ? Colors[colorScheme].subTextColor : Colors[colorScheme].textColor}
                    />
                  </TouchableOpacity>
                  <Text
                    style={[
                      themedStyles.subTaskText,
                      st.completed && { textDecorationLine: 'line-through', opacity: 0.6 }
                    ]}
                  >
                    {st.text}
                  </Text>
                  <TouchableOpacity onPress={() => removeSubTask(st.id)} style={{ marginLeft: widthPercentageToDP(2) }}>
                    <Icon name="close-circle" size={22} color="#e57373" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
            <View style={themedStyles.modalActions}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={themedStyles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={saveToDo}>
                <Text style={themedStyles.saveText}>{editToDo ? "Update" : "Save"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </SafeAreaView>
  );
};

export default ToDoScreen;

// Keep styles as a function, do not use colorScheme outside the component
const styles = (colorScheme: 'light' | 'dark') => StyleSheet.create({
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
    color: Colors[colorScheme].textColor,
  },
  addButton: {
    marginLeft: widthPercentageToDP(2),
  },
  switchSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: heightPercentageToDP(1.5),
  },
  switchBtn: {
    paddingVertical: heightPercentageToDP(0.8),
    paddingHorizontal: widthPercentageToDP(5),
    borderRadius: widthPercentageToDP(6),
    marginHorizontal: widthPercentageToDP(1.5),
    backgroundColor: 'transparent',
  },
  activeSwitchBtn: {
    backgroundColor: Colors[colorScheme].subTextColor + '22',
  },
  switchText: {
    color: Colors[colorScheme].textColor,
    fontWeight: '600',
    fontSize: heightPercentageToDP(2),
  },
  activeSwitchText: {
    color: Colors[colorScheme].subTextColor,
  },
  todoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors[colorScheme].subContainer,
    borderRadius: widthPercentageToDP(4),
    padding: widthPercentageToDP(4),
    marginBottom: heightPercentageToDP(2),
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: widthPercentageToDP(2),
    elevation: 2,
  },
  todoTitle: {
    fontSize: heightPercentageToDP(2.2),
    fontWeight: 'bold',
    color: Colors[colorScheme].subTextColor,
    marginBottom: heightPercentageToDP(0.5),
  },
  subTaskText: {
    fontSize: heightPercentageToDP(1.8),
    color: Colors[colorScheme].textColor,
    marginLeft: widthPercentageToDP(2),
    marginBottom: heightPercentageToDP(0.3),
  },
  subTaskInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentageToDP(1.2),
  },
  subTaskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: heightPercentageToDP(0.7),
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
    width: widthPercentageToDP(90),
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
    marginBottom: heightPercentageToDP(1.5),
  },
  input: {
    borderWidth: 1,
    borderColor: Colors[colorScheme].subTextColor,
    borderRadius: widthPercentageToDP(3),
    padding: heightPercentageToDP(1.2),
    marginBottom: heightPercentageToDP(1.5),
    color: Colors[colorScheme].textColor,
    backgroundColor: Colors[colorScheme].backgroundColor,
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
    color: Colors[colorScheme].subTextColor,
    fontWeight: 'bold',
    fontSize: heightPercentageToDP(2),
  },
});