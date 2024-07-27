import React, { useState } from 'react';
import { ScrollView, View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const PatientSignup = () => {
  const [patientName, setPatientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [email, setEmail] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [bloodGroup, setBloodGroup] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [reenterPassword, setReenterPassword] = useState('');
  const [imageUri, setImageUri] = useState(null);

  const navigation = useNavigation();

  const handleImagePicker = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      setImageUri(pickerResult.assets[0].uri); // Updated line to access the URI
    }
  };

  const handleSignup = () => {
    if (password !== reenterPassword) {
      Alert.alert("Passwords do not match!");
      return;
    }

    const signupApiUrl = 'http://192.168.40.121/Database/Patientsignup.php';

    let formData = new FormData();
    formData.append('pname', patientName);
    formData.append('mob', contactNumber);
    formData.append('mail', email);
    formData.append('gender', gender);
    formData.append('age', age);
    formData.append('bloodgroup', bloodGroup);
    formData.append('username', username);
    formData.append('pass', password);
    formData.append('cpass', reenterPassword);

    if (imageUri) {
      let filename = imageUri.split('/').pop();
      let match = /\.(\w+)$/.exec(filename);
      let type = match ? `image/${match[1]}` : `image`;

      formData.append('image_path', { uri: imageUri, name: filename, type });
    }

    fetch(signupApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    })
      .then(response => response.text())  // Changed from response.json() to response.text()
      .then(data => {
        console.log('Signup Response:', data);
        try {
          const jsonResponse = JSON.parse(data);
          if (jsonResponse.status === 'success') {
            Alert.alert('Signup successful!', '', [
              { text: 'OK', onPress: () => navigation.navigate('Patientlogin') }
            ]);
          } else {
            Alert.alert('Signup failed. Please try again.');
          }
        } catch (error) {
          Alert.alert('Signup failed. Please try again later.');
        }
      })
      .catch(error => {
        console.error('Signup Error:', error);
        Alert.alert('Signup failed. Please try again later.');
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Patient Signup</Text>
      </View>
      <ScrollView contentContainerStyle={styles.formContainer}>
        <TouchableOpacity onPress={handleImagePicker} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera" size={30} color="#3a3a3a" />
              <Ionicons name="add-circle" size={25} color="#3a3a3a" style={styles.plusIcon} />
            </View>
          )}
        </TouchableOpacity>

        <TextInput
          style={styles.input}
          placeholder="Name"
          value={patientName}
          onChangeText={setPatientName}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Contact Number"
          value={contactNumber}
          onChangeText={setContactNumber}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="E-Mail"
          value={email}
          onChangeText={setEmail}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Gender"
          value={gender}
          onChangeText={setGender}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Age"
          value={age}
          onChangeText={setAge}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Blood Group"
          value={bloodGroup}
          onChangeText={setBloodGroup}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
          placeholderTextColor="#000000"
        />

        <TextInput
          style={styles.input}
          placeholder="Re-enter Password"
          secureTextEntry={true}
          value={reenterPassword}
          onChangeText={setReenterPassword}
          placeholderTextColor="#000000"
        />

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginText} onPress={() => console.log("Navigate to Login screen")}>
          <Text style={[styles.logintext, { fontSize: 18, color: '#3a3a3a' }]}>Already a user? Login</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: width * 0.0001,
    paddingTop: windowHeight * 0.0010,
  },
  topContainer: {
    paddingTop: 10,
    paddingHorizontal: 10,
    backgroundColor: '#603F83FF',
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.14,
    top: windowHeight * -0.01,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color:'#FFFFFF',
    marginTop:30,
  },
  formContainer: {
    flexGrow: 1,
    marginTop: 20,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: windowHeight * 0.03,
    width: '80%',
    backgroundColor: '#F9F9F9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    left: 37,
  },
  button: {
    alignSelf: 'center',
    width: '30%',
    marginTop: 20,
    backgroundColor: '#603F83FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  loginText: {
    marginTop: 20,
    alignItems: 'center',
  },
  logintext: {
    fontSize: 16,
    color: '#3a3a3a',
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: windowHeight * 0.03,
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  plusIcon: {
    position: 'absolute',
    bottom: -5,
    right: -5,
  },
});

export default PatientSignup;
