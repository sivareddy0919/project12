import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Image, Alert } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import axios from 'axios';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Patientdetails = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { patient } = route.params;

  // State to hold patient data
  const [patientData, setPatientData] = useState([]);

  useEffect(() => {
    // Fetch patient data from your API or data source
    axios.get('http://192.168.40.121/Database/patients.php')
      .then(response => {
        setPatientData(response.data); // Adjust based on your API response
      })
      .catch(error => {
        console.error('Error fetching patient data:', error.response?.status, error.message);
      });
  }, []);

  const navigateToGlucoseInsulinRecord = () => {
    console.log('Navigating to Patientexcelrecord');
    navigation.navigate('Patientexcelrecord', { patientId: patient.id, username: patient.username });
  };

  const navigateToPatientTrackingGraph = () => {
    console.log('Navigating to Patientgraphrecord');
    navigation.navigate('Patientgraphrecord', { patientId: patient.id, username: patient.username });
  };

  const imageUrl = patient.image_path.startsWith('http') 
    ? patient.image_path 
    : `http://192.168.40.121/Database/${patient.image_path}`;

  const handleHomeNavigation = () => {
    navigation.navigate('Doctordashboard', { username: patient.username });
  };

  const handleSearchIconClick = () => {
    // Ensure patientData is not empty or undefined
    if (patientData.length > 0) {
      const patientsInfo = patientData.map(patient => ({
        username: patient.username,
        gender: patient.gender,
        image_path: patient.image_path,
        bloodgroup: patient.bloodgroup,
        age: patient.age,
        mob: patient.mob,
      }));
      navigation.navigate('DoctorSearch', { patientsInfo, username: patient.username });
    }
  };

  const handlePlusIconClick = () => {
    navigation.navigate('insulinentry');
  };

  const handleSignOutIconClick = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'YES',
          onPress: () => navigation.navigate('Doctorlogin'), // Perform logout action here
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.headerText}>Patient Details</Text>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.patientInfoContainer}>
          {patient.image_path && (
            <Image source={{ uri: imageUrl }} style={styles.patientImage} />
          )}
          <Text style={styles.patientName}>Patient Name: {patient.username}</Text>
          <Text style={styles.patientDetail}>Blood Group: {patient.bloodgroup}</Text>
          <Text style={styles.patientDetail}>Age: {patient.age}</Text>
          <Text style={styles.patientDetail}>Gender: {patient.gender}</Text>
          <Text style={styles.patientDetail}>Contact Num: {patient.mob}</Text>
        </View>
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.glucoseButton} onPress={navigateToGlucoseInsulinRecord}>
            <View style={styles.iconContainer}>
              <FontAwesome name="file-text" size={windowWidth * 0.1} color="#fff" />
              <Text style={styles.iconLabel}>Patient Record</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.trackingButton} onPress={navigateToPatientTrackingGraph}>
            <View style={styles.iconContainer}>
              <FontAwesome name="line-chart" size={windowWidth * 0.1} color="#fff" />
              <Text style={styles.iconLabel}>Tracking Graph</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <TouchableOpacity onPress={handleHomeNavigation} style={styles.bottomButton}>
          <FontAwesome name="home" size={35} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSearchIconClick} style={styles.bottomButton}>
          <FontAwesome name="search" size={32} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePlusIconClick} style={styles.bottomButton}>
          <FontAwesome name="plus" size={35} style={styles.bottomIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSignOutIconClick} style={styles.bottomButton}>
          <FontAwesome name="sign-out" size={35} style={styles.bottomIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  topContainer: {
    width: '100%',
    paddingVertical: windowHeight * 0.045,
    backgroundColor: '#603F83FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: windowWidth * 0.07,
    fontWeight: 'bold',
    color: '#FFFFFF',
    bottom: windowHeight * -0.01,
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  patientInfoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: windowWidth * 0.05,
    backgroundColor: '#DFDFDF',
    borderRadius: 20,
    marginBottom: windowHeight * 0.10,
    width: '85%', // Shadow properties for iOS
    shadowColor: '#000', // Color of the shadow
    shadowOffset: { width: 0, height: 4 }, // Offset of the shadow
    shadowOpacity: 0.3, // Opacity of the shadow
    shadowRadius: 6,  // Blur radius of the shadow  // Elevation for Android
    elevation: 5, // Elevation level of the shadow
  },
  patientImage: {
    width: windowWidth * 0.4,
    height: windowWidth * 0.4,
    borderRadius: windowWidth * 0.2,
    marginBottom: windowHeight * 0.02,
  },
  patientName: {
    fontSize: windowWidth * 0.055,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: windowHeight * 0.01,
  },
  patientDetail: {
    fontSize: windowWidth * 0.045,
    color: '#000000',
    marginBottom: windowHeight * 0.01,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '80%',
  },
  glucoseButton: {
    backgroundColor: '#603F83FF',
    padding: windowWidth * 0.05,
    borderRadius: windowWidth * 0.03,
    marginVertical: 10,
  },
  trackingButton: {
    backgroundColor: '#603F83FF',
    padding: windowWidth * 0.05,
    borderRadius: windowWidth * 0.03,
    marginVertical: 10,
  },
  iconContainer: {
    alignItems: 'center',
  },
  iconLabel: {
    color: '#fff',
    marginTop: windowHeight * 0.01,
    fontSize: windowWidth * 0.04,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '85%',
    borderRadius: 20,
    backgroundColor: '#603F83FF',
    paddingVertical: windowHeight * 0.02,
    marginBottom: windowHeight * 0.04,
    marginLeft: windowWidth * 0.08,
  },
  bottomButton: {
    alignItems: 'center',
  },
  bottomIcon: {
    color: '#fff',
  },
});

export default Patientdetails;
