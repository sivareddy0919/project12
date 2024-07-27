import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, Alert, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const InsulinEntry = ({ navigation }) => {
  const [pendingData, setPendingData] = useState([]);
  const [completedData, setCompletedData] = useState([]);
  const [insulinIntakes, setInsulinIntakes] = useState({});
  const [showPending, setShowPending] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`http://192.168.40.121/Database/insulinlevel.php`);
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
      const response = await axios.put(`http://192.168.40.121/Database/insulinentry.php`, {
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

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <Text style={styles.itemText}>Sugar Concentration: {item.sugar_concentration}</Text>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake}</Text>
      {showPending && (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter InsulinIntake Value"
            placeholderTextColor="#000000"
            value={insulinIntakes[item.id] || ''}
            onChangeText={text => handleInsulinIntakeChange(item.id, text)}
          />
          <View style={styles.addButtonContainer}>
            <Button
              title="Add Insulin Intake"
              onPress={() => handleUpdateInsulinIntake(item.id)}
            />
          </View>
        </>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>Insulin Entry</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.pendingButton, showPending && styles.selectedButton]}
          onPress={() => setShowPending(true)}
        >
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.completedButton, !showPending && styles.selectedButton]}
          onPress={() => navigation.navigate('completedScreen')}
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
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    padding: windowWidth * 0.025,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    height: windowHeight * 0.12,
  },
  topText: {
    fontSize: windowWidth * 0.065,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.05,
  },
  buttonContainer: {
    flexDirection: 'row',
    width:'90%',
    justifyContent: 'space-between',
    marginHorizontal: windowWidth * 0.025,
    marginVertical: windowHeight * 0.015,
  },
  pendingButton: {
    width: '40%',
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    paddingVertical: windowHeight * 0.01,
    borderRadius: windowWidth * 0.05,
    marginLeft: windowWidth * 0.05,
    marginTop: windowHeight * 0.01,
  },
  completedButton: {
    width: '40%',
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    paddingVertical: windowHeight * 0.015,
    borderRadius: windowWidth * 0.05,
    marginRight: windowWidth * 0.05,
    marginTop: windowHeight * 0.01,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: windowWidth * 0.04,
  },
  listContainer: {
    flex: 1,
    padding: windowWidth * 0.02,
    width:'90%',
    left:windowWidth*0.05,
  },
  itemContainer: {
    marginBottom: windowHeight * 0.01,
    backgroundColor: '#603F83FF',
    borderRadius: windowWidth * 0.025,
    padding: windowWidth * 0.04,
    height:windowHeight * 0.33,
    marginBottom: windowHeight *0.02,
  },
  itemText: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.005,
    color: '#FFFFFF',
  },
  input: {
    height: windowHeight * 0.05,
    borderColor: '#FFFFFF',
    marginBottom: windowHeight * 0.01,
    width: '90%',
    backgroundColor: '#FFFFFF',
    color: '#000000',
    borderRadius: 8,
    marginTop:windowHeight *0.005,
    paddingHorizontal: windowWidth * 0.025,
  },
  addButtonContainer: {
    width: '70%',
    marginLeft: windowWidth * 0.1,
    marginBottom: windowHeight * 0.01,
    borderRadius: 10,
    overflow: 'hidden',
  },
  addButton: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default InsulinEntry;
