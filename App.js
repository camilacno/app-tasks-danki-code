import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  TouchableHighlight,
  AsyncStorage,
} from 'react-native';
import { AppLoading } from 'expo';
import { AntDesign } from '@expo/vector-icons';
import { useFonts, Lato_400Regular } from '@expo-google-fonts/lato';

export default function App() {
  const bgImg = require('./src/assets/bg.jpg');

  const [tasks, setTasks] = useState([]);
  const [modal, setModal] = useState(false);
  const [currentTask, setCurrentTask] = useState('');

  let [fontsLoaded] = useFonts({
    Lato_400Regular,
  });

  useEffect(() => {
    (async () => {
      try {
        let currentTasks = await AsyncStorage.getItem('tasks');
        if (currentTasks == null) setarTarefas([]);
        else setTasks(JSON.parse(currentTasks));
      } catch (error) {
        // Error saving data
      }
    })();
  }, []);

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  function deleteTask(id) {
    let updatedTasks = tasks.filter((val) => {
      return val.id !== id;
    });
    setTasks(updatedTasks);

    (async () => {
      try {
        await AsyncStorage.setItem('tasks', JSON.stringify(updatedTasks));
      } catch (error) {
        // Error saving data
      }
    })();

    alert(`Task deleted successfully!`);
  }

  async function addTask() {
    setModal(!modal);

    let id = 0;
    if (tasks.length > 0) {
      id = tasks[tasks.length - 1].id + 1;
    }

    let newTask = { id: id, description: currentTask };

    setTasks([...tasks, newTask]);

    (async () => {
      try {
        await AsyncStorage.setItem(
          'tasks',
          JSON.stringify([...tasks, newTask])
        );
      } catch (error) {
        // Error saving data
      }
    })();
    alert(`Task "${newTask.description}" added successfully!`);
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden />

      <Modal
        animationType='slide'
        transparent={true}
        visible={modal}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              autoFocus={true}
              style={styles.modalText}
              placeholder='Type your task here'
              onChangeText={(text) => setCurrentTask(text)}
            ></TextInput>

            <TouchableHighlight
              style={{ ...styles.openButton, backgroundColor: '#cfa16d' }}
              onPress={() => {
                addTask();
              }}
            >
              <Text style={styles.textStyle}>Finish</Text>
            </TouchableHighlight>
          </View>
        </View>
      </Modal>

      <ImageBackground source={bgImg} style={styles.image}>
        <View style={styles.coverView}>
          <Text style={styles.textHeader}>To do list - Danki Code</Text>
        </View>
      </ImageBackground>

      <ScrollView>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskSingle}>
            <Text
              style={{ flex: 1, width: '100%', padding: 10, color: 'black' }}
            >
              {task.description}
            </Text>

            <TouchableOpacity
              style={{ flex: 1, alignItems: 'flex-end', padding: 10 }}
              onPress={() => deleteTask(task.id)}
            >
              <AntDesign name='minuscircleo' size={24} color='black' />
            </TouchableOpacity>
          </View>
        ))}

        <TouchableOpacity
          style={styles.btnAddTask}
          onPress={() => setModal(true)}
        >
          <AntDesign
            name='pluscircleo'
            size={24}
            color='#fff'
            style={{ padding: 10 }}
          />
          <Text style={{ color: '#fff', fontWeight: 'bold' }}>Add task</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  textHeader: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    paddingLeft: 10,
    fontFamily: 'Lato_400Regular',
  },
  coverView: {
    width: '100%',
    height: 100,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
  },
  taskSingle: {
    marginTop: 30,
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: 'black',
    flexDirection: 'row',
    paddingBottom: 10,
  },
  btnAddTask: {
    flex: 1,
    width: '40%',
    margin: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cfa16d',
    borderRadius: 20,
  },
  // Modal styles
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 5,
  },
  openButton: {
    backgroundColor: '#a17543',
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
