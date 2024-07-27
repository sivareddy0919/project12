import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Patientcompletedscreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;

  const [completedData, setCompletedData] = useState([]);

  useEffect(() => {
    fetchCompletedData();
  }, []);

  const fetchCompletedData = async () => {
    try {
      const response = await axios.get('http://192.168.40.121/Database/Patientcompletedentries.php', {
        params: { username }
      });
      if (response.data.status === 'success') {
        // Reverse the data to show the most recent entries first
        setCompletedData(response.data.data.reverse());
      } else {
        console.error('Failed to fetch data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>Username: {item.username}</Text>
      <Text style={styles.itemText}>Date: {item.datetime}</Text>
      <Text style={styles.itemText}>Note: {item.note}</Text>
      <Text style={styles.itemText}>Session: {item.session}</Text>
      <Text style={styles.itemText}>Sugar Concentration: {item.sugar_concentration} {item.unit}</Text>
      <Text style={styles.itemText}>Insulin Intake: {item.insulinintake}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.topText}>Completed Entries</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Glucosepending', { username })}
        >
          <Text style={styles.buttonText}>Pending</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Patientcompletedentries', { username })}
        >
          <Text style={styles.buttonText}>Completed</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={completedData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: windowWidth * 0.025,
  },
  topContainer: {
    padding: windowWidth * 0.025,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    marginBottom: windowHeight * 0.0125,
    height: windowHeight * 0.1125,
    width: windowWidth * 1.09,
    right: windowWidth * 0.025,
    marginTop: -windowHeight * 0.0125,
  },
  topText: {
    fontSize: windowWidth * 0.055,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.05,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: windowHeight * 0.016,
    marginBottom: windowHeight * 0.02,
    marginHorizontal: windowWidth * 0.01,
  },
  button: {
    backgroundColor: '#603F83FF',
    padding: windowWidth * 0.025,
    borderRadius: 10,
    width: windowWidth * 0.4,
    height: windowHeight * 0.06,
    borderRadius: 20,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: windowWidth * 0.045,
    fontWeight: 'bold',
  },
  itemContainer: {
    marginBottom: windowHeight * 0.0125,
    backgroundColor: '#603F83FF',
    borderRadius: 10,
    padding: windowWidth * 0.05,
    paddingVertical: windowHeight * 0.02,
    width: '94%',
    marginLeft: windowWidth * 0.03,
  },
  itemText: {
    fontSize: windowWidth * 0.04,
    marginBottom: windowHeight * 0.00625,
    color: '#FFFFFF',
  },
});

export default Patientcompletedscreen;
