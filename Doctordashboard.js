import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity, Alert, Animated } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const Doctordashboard = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;

  const [patientData, setPatientData] = useState([]);
  const [pendingEntries, setPendingEntries] = useState([]); // Initialize as an empty array
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const menuAnimation = useState(new Animated.Value(-250))[0];

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const response = await fetch('http://192.168.40.121/Database/Viewall.php');
        const data = await response.json();
        setPatientData(data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    const fetchPendingEntries = async () => {
      try {
        const response = await fetch('http://192.168.40.121/Database/RecentPatients.php');
        const result = await response.json();
        if (result.status === 'success' && Array.isArray(result.data)) { // Ensure result.data is an array
          setPendingEntries(result.data);
        } else {
          console.error('Unexpected data format:', result);
        }
      } catch (error) {
        console.error('Error fetching pending entries:', error);
      }
    };

    fetchPatientData();
    fetchPendingEntries();
  }, []);

  const handleProfileNavigation = () => {
    navigation.navigate('Doctorprofile');
  };

  const handleSearchIconClick = () => {
    const patientsInfo = patientData.map(patient => ({
      username: patient.username,
      gender: patient.gender,
      image_path: patient.image_path,
      bloodgroup: patient.bloodgroup,
      age: patient.age,
      mob: patient.mob,
    }));
    navigation.navigate('DoctorSearch', { patientsInfo });
  };

  const handleViewAllClick = () => {
    const patientsInfo = patientData.map(patient => ({
      username: patient.username,
      gender: patient.gender,
      image_path: patient.image_path,
      bloodgroup: patient.bloodgroup,
      age: patient.age,
      mob: patient.mob,
    }));
    navigation.navigate('DoctorSearch', { patientsInfo });
  };

  const handlePlusIconClick = () => {
    navigation.navigate('insulinentry');
  };

  const handleSignOutIconClick = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to Logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => navigation.navigate('Doctorlogin') },
      ],
      { cancelable: false }
    );
  };

  const handleMenuIconClick = () => {
    setIsModalVisible(true);
    Animated.timing(menuAnimation, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const closeMenu = () => {
    setIsModalVisible(false);
    Animated.timing(menuAnimation, {
      toValue: -250,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const handleHomeNavigation = () => {
    navigation.navigate('Doctordashboard', { username });
    closeMenu();
  };

  const handlePatientListNavigation = () => {
    const patientsInfo = patientData.map(patient => ({
      username: patient.username,
      gender: patient.gender,
      image_path: patient.image_path,
      bloodgroup: patient.bloodgroup,
      age: patient.age,
      mob: patient.mob,
    }));
    navigation.navigate('DoctorSearch', { patientsInfo });
  };

  const handleScroll = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setCurrentImageIndex(index);
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <TouchableOpacity style={styles.menuIconContainer} onPress={handleMenuIconClick}>
          <FontAwesome name="bars" size={34} style={styles.menuIcon} />
        </TouchableOpacity>
        <Text style={styles.heading}>{username}</Text>
        <TouchableOpacity onPress={handleProfileNavigation}>
          <FontAwesome name="user" size={30} style={styles.profileIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.container}>
        <View style={styles.upperContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.scrollContainer}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            <Image source={require('./assets/scroll1.png')} style={styles.image} />
            <Image source={require('./assets/scroll2.png')} style={styles.image} />
            <Image source={require('./assets/scroll3.png')} style={styles.image} />
          </ScrollView>
        </View>
        <View style={styles.scrollIndicatorContainer}>
          <View style={[styles.scrollIndicator, currentImageIndex === 0 && styles.scrollIndicatorActive]} />
          <View style={[styles.scrollIndicator, currentImageIndex === 1 && styles.scrollIndicatorActive]} />
          <View style={[styles.scrollIndicator, currentImageIndex === 2 && styles.scrollIndicatorActive]} />
        </View>
        <View style={styles.grayContainer}>
          {pendingEntries.length > 0 ? (
            <ScrollView horizontal contentContainerStyle={styles.scrollContainer}>
              {pendingEntries.map(entry => (
                <View key={entry.id} style={styles.pendingEntryContainer}>
                  <Image source={{ uri: `http://192.168.40.121/Database/${entry.image_path}` }} style={styles.profileImage} />
                  <Text style={styles.pendingEntryText}>{entry.username}</Text>
                  <Text style={styles.pendingEntryText}>Sugar: {entry.sugar_concentration}</Text>
                </View>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.noPendingEntriesText}>No pending entries</Text>
          )}
        </View>
        <View style={styles.scrollWrapper}>
          <ScrollView style={styles.newContainer}>
            {patientData.map(patient => (
              <View key={patient.id} style={styles.patientInnerContainer}>
                <Image source={{ uri: `http://192.168.40.121/Database/${patient.image_path}` }} style={styles.patientImage} />
                <View style={styles.patientInfo}>
                  <Text style={styles.patientText}>Username: {patient.username}</Text>
                  <Text style={styles.patientText}>Gender: {patient.gender}</Text>
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Patientdetails', {
                    patient: {
                      username: patient.username,
                      gender: patient.gender,
                      image_path: patient.image_path,
                      bloodgroup: patient.bloodgroup,
                      age: patient.age,
                      mob: patient.mob,
                    }
                  })}
                >
                  <Text style={styles.detailsButtonText}>Details</Text>
                </TouchableOpacity>
              </View>
            ))}
          </ScrollView>
        </View>
        <View style={styles.additionalGrayContainer}>
          <FontAwesome name="home" size={35} style={styles.homeIcon} onPress={handleHomeNavigation} />
          <FontAwesome name="search" size={32} style={styles.searchIcon} onPress={handleSearchIconClick} />
          <FontAwesome name="plus" size={35} style={styles.plusIcon} onPress={handlePlusIconClick} />
          <FontAwesome name="sign-out" size={35} style={styles.signOutIcon} onPress={handleSignOutIconClick} />
        </View>
      </View>
      {isModalVisible && (
        <Animated.View style={[styles.modalContainer, { transform: [{ translateX: menuAnimation }] }]}>
          <TouchableOpacity onPress={handleHomeNavigation} style={styles.menuItem}>
            <FontAwesome name="home" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Home</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOutIconClick} style={styles.menuItem}>
            <FontAwesome name="bell" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Notification's</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleProfileNavigation} style={styles.menuItem}>
            <FontAwesome name="user" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePatientListNavigation} style={styles.menuItem}>
            <FontAwesome name="users" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Patient List</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignOutIconClick} style={styles.menuItem}>
            <FontAwesome name="sign-out" size={24} style={styles.menuIcon} />
            <Text style={styles.menuText}>Sign Out</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
      <TouchableOpacity style={styles.floatingButton} onPress={handleViewAllClick}>
     <Text style={styles.floatingButtonText}>View All</Text>
   </TouchableOpacity>
    </View>
  );
};

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  topContainer: {
    paddingTop: windowHeight * 0.05,
    paddingHorizontal: windowWidth * 0.05,
    backgroundColor: '#603F83FF',
    height: windowHeight * 0.14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  menuIconContainer: {
    marginLeft: 10,
  },
  menuIcon: {
    color: '#DFDFDF',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#DFDFDF',
  },
  modalContainer: {
    position: 'absolute',
    top: 107,
    left: 0,
    width: '80%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  profileIcon: {
    color: '#DFDFDF',
    right: windowWidth * 0.05
  },
  container: {
    flex: 1,
    backgroundColor:'#FFFFFF'
  },
  upperContainer: {
    marginTop: windowHeight * 0.01,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  image: {
    width: windowWidth * 0.9,
    height: windowHeight * 0.2,
    marginHorizontal: 10,
    borderRadius: 5,
  },
  scrollIndicatorContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
    marginBottom: windowHeight * 0.03,
  },
  scrollIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#DFDFDF',
    marginHorizontal: 7,
  },
  scrollIndicatorActive: {
    backgroundColor: '#603F83FF',
  },
  grayContainer: {
    backgroundColor: '#DFDFDF',
    borderRadius: 10,
    width:windowWidth * 0.9,
    height:windowHeight *0.15,
    paddingVertical: windowHeight * 0.01,
    marginBottom: windowHeight * 0.04,
    alignSelf: 'center',
    marginTop: windowHeight * -0.02,
  },
  profileImage: { 
    width: 50,
    height: 50,
    borderRadius: 25,
    marginBottom: 10,
  },
  scrollContainer: {
    flexDirection: 'row',
  },
  pendingEntryContainer: {
    padding: 10,
    width:windowWidth * 0.40,
    height:windowHeight *0.1,
    marginTop:windowWidth * 0.03,
    marginLeft:windowWidth * 0.03,
    marginRight:windowWidth * 0.01,
    borderRadius:10,
    backgroundColor: '#603F83FF', // Optional: Adds a background color to each entry
 // Space between entries in horizontal scroll
  },
  pendingEntryText: {
    fontSize: 16,
    marginBottom:windowHeight*-0.1,
    color: '#FFFFFF', // Optional: Adjust text color for better readability
  },
  scrollWrapper: {
    backgroundColor: '#DFDFDF',
    borderRadius: 15,
    width: '90%',
    height: windowHeight * 0.3,
    marginBottom: windowHeight * 0.02,
    marginTop: windowHeight * 0.01,
    alignSelf: 'center',
  },
  newContainer:{
    backgroundColor:'#DFDFDF',
    marginTop: windowWidth *-0.05,
    borderRadius:10,
  },
  patientInnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#603F83FF',
    padding: 9,
    borderRadius: 10,
    marginTop: windowWidth *0.03,
    marginBottom: windowHeight * 0.01,
    width: '90%',
    alignSelf: 'center',
  },
  patientImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  patientInfo: {
    flex: 1,
  },
  patientText: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  detailsButtonText: { 
    color: '#FFFFFF',
    marginTop: windowHeight * 0.04,
  },
  additionalGrayContainer: {
    backgroundColor: '#603F83FF',
    borderRadius: 15,
    width: '85%',
    paddingVertical: windowHeight * 0.022,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: windowWidth * 0.1,
    marginTop: windowHeight * 0.005,
    alignSelf: 'center',
  },
  homeIcon: {
    color: '#DFDFDF',
  },
  plusIcon: {
    color: '#DFDFDF',
  },
  searchIcon: {
    color: '#DFDFDF',
  },
  signOutIcon: {
    color: '#DFDFDF',
  },
  modalContainer: {
    position: 'absolute',
    top: 107,
    left: 0,
    width: '75%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1.5,
    borderBottomColor: '#DDD',
  },
  menuText: {
    fontSize: 18,
    marginLeft: 15,
    color: '#000000',
  },
  closeButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#000000',
    fontSize: 18,
  },
  floatingButton: {
    bottom: 20,
    right: windowWidth * -0.76,
    backgroundColor: '#DFDFDF',
    width: windowWidth *0.18,
    height: windowHeight * 0.03,
    marginBottom : windowHeight * 0.13,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  floatingButtonText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: 'bold',
    color: '#000000',
    textDecorationLine: 'underline',
  
  }
});

export default Doctordashboard;
