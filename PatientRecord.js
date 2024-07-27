import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const Patientcompletedscreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username, startDate, endDate } = route.params;

  const [completedData, setCompletedData] = useState([]);

  useEffect(() => {
    fetchCompletedData();
  }, [username, startDate, endDate]);

  const fetchCompletedData = async () => {
    try {
      const response = await axios.get('http://192.168.40.121/Database/PatientRecord.php', {
        params: { 
          username, 
          start_date: startDate, 
          end_date: endDate 
        }
      });
      if (response.data.status === 'success') {
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
    marginTop: windowHeight * 0.04,
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
