import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRoute } from '@react-navigation/native';
import axios from 'axios';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const IndividualinsulinEntry = ({ navigation }) => {
  const route = useRoute();
  const { username, datetime, sugar_concentration, note, unit, session, insulinintake } = route.params;

  const [insulinIntake, setInsulinIntake] = useState(insulinintake || '');

  const handleUpdateInsulinIntake = async () => {
    try {
      const params = {
        username: username,
        datetime: datetime,
        sugar_concentration: sugar_concentration,
        note: note,
        unit: unit,
        session: session,
        insulinintake: insulinIntake
      };

      console.log('Sending parameters:', params); // Log the parameters

      const response = await axios.post('http://192.168.40.121/Database/IndividualinsulinEntry.php', params);

      console.log('API response:', response.data); // Log the response to inspect its structure

      if (response.data && response.data.status === "success") {
        Alert.alert('Success', response.data.message);
        navigation.goBack();
      } else {
        Alert.alert('Error', response.data ? response.data.message : 'Unexpected response structure');
      }
    } catch (error) {
      console.error('Error updating insulin intake:', error);
      Alert.alert('Error', `Failed to update insulin intake: ${error.message}`);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Insulin Entry Details</Text>
      </View>
      <View style={styles.dataContainer}>
        <Text style={styles.valueText}>Username: {username}</Text>
        <Text style={styles.valueText}>Date: {datetime}</Text>
        <Text style={styles.valueText}>Note: {note}</Text>
        <Text style={styles.valueText}>Session: {session}</Text>
        <Text style={styles.valueText}>Sugar Concentration: {`${sugar_concentration} ${unit}`}</Text>zzzz
        <Text style={styles.valueText}>Insulin Intake:</Text>
        <TextInput></TextInput>
          style={styles.input}
          placeholder="Enter the Insulin intake value"
          placeholderTextColor='#603F83FF'
          value={insulinIntake}
          onChangeText={setInsulinIntake}
        />
        <TouchableOpacity style={styles.button} onPress={handleUpdateInsulinIntake}>
          <Text style={styles.buttonText}>Add Insulin Level</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: windowWidth * 0.05,
    backgroundColor: '#fff',
  },
  topContainer: {
    marginBottom: windowHeight * 0.02,
    backgroundColor: '#603F83FF',
    padding: windowHeight * 0.02,
    height: windowHeight * 0.14,
    width: '120%',
    marginTop: windowHeight * -0.026,
    right: windowWidth * 0.1,
    borderRadius: 10,
  },
  dataContainer: {
    backgroundColor: '#603F83FF',
    padding: windowHeight * 0.02,
    borderRadius: 10,
    height: windowHeight * 0.4,  // Adjust height as needed
    width: windowWidth * 0.9,  // Adjust width as needed
    alignSelf: 'center',  // Center the container horizontally
  },
  heading: {
    fontSize: windowWidth * 0.06,
    marginTop: windowHeight * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#FFFFFF',
  },
  valueText: {
    fontSize: windowWidth * 0.04,
    marginLeft: windowWidth * 0.03,
    color: '#FFFFFF',
    marginBottom: windowHeight * 0.009,
  },
  input: {
    marginTop: windowHeight * 0.02,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    paddingHorizontal: windowWidth * 0.03,
    paddingVertical: windowHeight * 0.01,
    backgroundColor: '#FFFFFF',  // Added background color
    color: '#603F83FF',  // Text color inside the input
    fontSize: windowWidth * 0.04,
  },
  button: {
    marginTop: windowHeight * 0.02,
    backgroundColor: '#FFFFFF',
    paddingVertical: windowHeight * 0.01,
    paddingHorizontal: windowWidth * 0.04,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#603F83FF',
    fontSize: windowWidth * 0.04,
    fontWeight: 'bold',
  },
});

export default IndividualinsulinEntry;
