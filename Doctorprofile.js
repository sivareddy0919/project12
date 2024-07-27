import React, { useEffect, useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Image } from 'react-native';
import axios from 'axios';
import { launchImageLibrary } from 'react-native-image-picker';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const DoctorProfile = () => {
  const defaultImagePath = 'http://192.168.40.121/Database/uploads/Doctorimage.jpg';
  const [doctorName, setDoctorName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [qualifications, setQualifications] = useState('');
  const [imagePath, setImagePath] = useState(defaultImagePath);

  useEffect(() => {
    // Fetch doctor details from the backend
    axios.get('http://192.168.40.121/Database/Doctorprofile.php')
      .then(response => {
        const doctor = response.data[0];
        setDoctorName(doctor.doctorname);
        setContactNumber(doctor.contactNumber);
        setEmail(doctor.email);
        setQualifications(doctor.qualification);
        if (doctor.imagepath) {
          setImagePath(`http://192.168.40.121/Database/uploads/${doctor.imagepath}`);
        }
      })
      .catch(error => {
        console.error("There was an error fetching the doctor profile!", error);
      });
  }, []);

  const handleImagePick = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.assets) {
        const selectedImage = response.assets[0];
        setImagePath(selectedImage.uri);
      }
    });
  };

  const handleSignup = () => {
    // Handle signup logic
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Profile</Text>
      </View>
      <View style={styles.imageContainer}>
        <TouchableOpacity onPress={handleImagePick}>
          <Image
            source={{ uri: imagePath }}
            style={styles.image}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={doctorName}
          onChangeText={setDoctorName}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={contactNumber}
          onChangeText={setContactNumber}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>E-Mail</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Qualification</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={qualifications}
          onChangeText={setQualifications}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}></Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: windowWidth * 0.05,
    paddingTop: windowHeight * 0.02,
  },
  topContainer: {
    paddingTop: 20,
    paddingRight: 30,
    backgroundColor: '#603F83FF',
    borderBottomColor: 'black',
    height: windowHeight * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
    width: windowWidth * 1.2,
    top: windowHeight * -0.02,
    right: windowWidth * 0.1,
  },
  heading: {
    fontSize: windowWidth * 0.08,
    marginTop: windowHeight * 0.03,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: windowHeight * 0.02,
    marginLeft: windowWidth * 0.2,
    marginTop: windowWidth * 0.05,
  },
  image: {
    width: windowWidth * 0.40,
    height: windowWidth * 0.40,
    borderRadius: windowWidth * 0.20,
    marginRight: windowHeight * 0.09,
    backgroundColor: 'red'
  },
  inputContainer: {
    marginBottom: windowHeight * 0.02,
    paddingHorizontal: windowHeight * 0.001,
    alignItems: 'flex-start',
    marginLeft: windowWidth * 0.05,
    width: '100%'
  },
  label: {
    fontSize: windowWidth * 0.049,
    marginBottom: 5,
  },
  input: {
    fontSize: windowWidth * 0.048,
    borderColor: '#FFFFFF',
    borderRadius: windowWidth * 0.04,
    padding: windowWidth * 0.028,
    width: '90%',
    backgroundColor: '#BBB7B7',
    marginLeft: windowHeight * -0.001
  },
});

export default DoctorProfile;
