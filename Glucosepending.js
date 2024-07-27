import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TextInput, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useRoute, useFocusEffect } from '@react-navigation/native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Insulinentry = ({ navigation }) => {
  const route = useRoute();
  const { username } = route.params;

  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [insulinIntakes, setInsulinIntakes] = useState({});
  const [showPending, setShowPending] = useState(true);

  useEffect(() => {
    console.log("Username passed to Insulinentry:", username);
    fetchData();
  }, []);

  useFocusEffect(
    useCallback(() => {
      setShowPending(true); // Ensure pending data is shown when screen is focused
      fetchData();
    }, [])
  );

  const fetchData = async () => {
    try {
      const response = await axios.get('http://192.168.40.121/Database/PatientGlucosepending.php', {
        params: { username }
      });
      console.log("API Response:", response.data);
      if (response.data.status === 'success') {
        const data = response.data.data;
        setPendingData(data.filter(item => item.status !== 'completed'));
        setCompletedData(data.filter(item => item.status === 'completed'));
      } else {
        console.error('Failed to fetch data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleUpdateInsulinIntake = async (id) => {
    try {
      const insulinIntake = insulinIntakes[id] || '';
      const response = await axios.put('http://192.168.40.121/Database/insulinentry.php', {
        id: id,
        insulinintake: insulinIntake
      });
      if (response.data.status === 'success') {
        const updatedItem = pendingData.find(item => item.id === id);
        updatedItem.insulinintake = insulinIntake;
        updatedItem.status = 'completed';

        setPendingData(pendingData.filter(item => item.id !== id));
        setCompletedData([...completedData, updatedItem]);

        Alert.alert('Success', 'Insulin intake updated successfully');
      } else {
        Alert.alert('Error', 'Failed to update insulin intake');
      }
    } catch (error) {
      console.error('Error updating insulin intake:', error);
      Alert.alert('Error', 'Failed to update insulin intake');
    }
  };

  const handleInsulinIntakeChange = (id, value) => {
    setInsulinIntakes(prev => ({ ...prev, [id]: value }));
  };

  const handleCompletedNavigation = () => {
    setShowPending(false);
    navigation.navigate('Patientcompletedentries', { username });
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <View style={styles.row}>
        <Text style={styles.itemText}>
          Sugar Concentration: {item.sugar_concentration} {item.unit}
        </Text>
      </View>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake}</Text>
      {showPending && (
        <TextInput
          style={styles.input}
          placeholder="InsulinIntake Value pending"
          placeholderTextColor="#000000"
          value={insulinIntakes[item.id] || ''}
          onChangeText={text => handleInsulinIntakeChange(item.id, text)}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>Insulin Record</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => setShowPending(true)}
        >
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={handleCompletedNavigation}
        >
          <Text style={styles.buttonText}>Completed</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.listContainer}>
        <FlatList
          data={showPending ? pendingData : completedData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  topContainer: {
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    height: windowHeight * 0.12,
  },
  topText: {
    fontSize: windowWidth * 0.07,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.06,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: windowWidth * 0.05,
    marginTop:windowHeight * 0.02,
    marginBottom:windowHeight * 0.01,
    backgroundColor: '#FFFFFF',
    height:windowHeight * 0.06,
  },
  button: {
    width: windowWidth * 0.4,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    paddingVertical: windowHeight * 0.0,
    borderRadius: 20,
    height:windowHeight * 0.06,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.046,
    top:windowHeight * 0.015,
  },
  listContainer: {
    flex: 1,
    padding: windowWidth * 0.03,
  },
  itemContainer: {
    marginBottom: windowHeight * 0.02,
    backgroundColor: '#603F83FF',
    borderRadius: 10,
    padding: windowWidth * 0.03,
  },
  itemText: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.01,
    color: '#FFFFFF',
  },
  input: {
    height: windowHeight * 0.05,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: windowHeight * 0.01,
    width: windowWidth * 0.7,
    backgroundColor: '#FFFFFF',
    color: '#000000',
    paddingHorizontal: windowWidth * 0.03,
  },
});

export default Insulinentry;
