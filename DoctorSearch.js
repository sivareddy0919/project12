import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TextInput, Image, FlatList, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DoctorSearch = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigation = useNavigation();
  const route = useRoute();
  const { patientsInfo } = route.params;

  useEffect(() => {
    if (patientsInfo && patientsInfo.length > 0) {
      setSearchResults(patientsInfo);
    }
  }, [patientsInfo]);

  useEffect(() => {
    const filteredPatients = patientsInfo.filter(patient =>
      patient.username.toLowerCase().includes(searchText.toLowerCase())
    );
    setSearchResults(filteredPatients);
  }, [searchText, patientsInfo]);

  const renderPatientItem = ({ item }) => {
    const imageUrl = `http://192.168.40.121/Database/${item.image_path}`;
    console.log('Loading image from:', imageUrl);  // Log the image URL

    return (
      <TouchableOpacity onPress={() => navigation.navigate('Patientdetails', { patient: item })}>
        <View key={item.id} style={styles.patientContainer}>
          {item.image_path && (
            <Image
              source={{ uri: imageUrl }}
              style={styles.patientImage}
              onError={(error) => console.log('Image load error:', error.nativeEvent.error)}
            />
          )}
          <View style={styles.patientInfo}>
            <Text style={styles.patientText}>Username: {item.username}</Text>
            <Text style={styles.patientText}>Gender: {item.gender}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Search Patients</Text>
      </View>
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={windowWidth * 0.06} color="black" style={styles.searchIcon} />
        <TextInput
          placeholder="Search Patients..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={text => setSearchText(text)}
        />
      </View>
      {Array.isArray(searchResults) && searchResults.length > 0 && (
        <Text style={styles.resultsHeading}>Results</Text>
      )}
      <FlatList
        data={searchResults}
        renderItem={renderPatientItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.resultContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    paddingTop: windowHeight * 0.02,
    paddingRight: windowWidth * 0.05,
    backgroundColor: '#603F83FF',
    height: windowHeight * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth,
  },
  heading: {
    fontSize: windowWidth * 0.07,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: windowHeight * 0.04,
    left:windowWidth *0.03,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: windowHeight * 0.1,
    width: '80%',
    backgroundColor: '#DFDFDF',
    paddingHorizontal: windowWidth * 0.02,
    borderRadius: windowWidth * 0.07,
    top: windowHeight * -0.03,
    left: windowWidth * 0.12,
  },
  searchIcon: {
    marginLeft: windowWidth * 0.03,
  },
  searchInput: {
    fontSize: windowWidth * 0.05,
    paddingVertical: windowHeight * 0.015,
    marginLeft: windowWidth * 0.03,
    fontWeight: 'bold',
    flex: 1,
  },
  resultsHeading: {
    fontSize: windowWidth * 0.056,
    color: 'black',
    fontWeight: 'bold',
    marginTop: windowHeight * -0.009,
    marginBottom: windowHeight * 0.01,
    alignSelf: 'center',
  },
  patientContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#603F83FF',
    borderRadius: 10,
    marginHorizontal: windowWidth * 0.05,
    marginBottom: windowHeight * 0.02,
    padding: 10,
  },
  patientImage: {
    width: windowWidth * 0.15,
    height: windowWidth * 0.15,
    borderRadius: windowWidth * 0.1,
    marginRight: windowWidth * 0.05,
  },
  patientInfo: {
    flex: 1,
  },
  patientText: {
    fontSize: windowWidth * 0.045,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  resultContainer: {
    paddingBottom: windowHeight * 0.05,
  },
});

export default DoctorSearch;
