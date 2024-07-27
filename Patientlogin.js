import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const PatientLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Initialize navigation hook

  const handleLogin = () => {
    // Perform your login logic here
    const loginApiUrl = 'http://192.168.40.121/Database/patientlogin.php';
    
    fetch(loginApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log('Login Response:', data);
        if (data.status === 'success') {
          Alert.alert('Login successful!');
          setUsername(''); // Clear username
          setPassword(''); // Clear password
          navigation.navigate('Duplicate', { username }); // Navigate to the Duplicate screen with username parameter
        } else {
          Alert.alert('Invalid username or password. Please try again.');
        }
      })
      .catch(error => {
        console.error('Fetch Error:', error);
        Alert.alert('Login failed. Please try again later.');
      });
  };

  const handleSignup = () => {
    // Navigate to PatientSignup screen
    navigation.navigate('Patientsignup');
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Patient Login</Text>
        <Image source={require('./assets/scroll3.png')} style={styles.logo} />
      </View>
      <View style={styles.backgroundContainer}>
        <View style={styles.container}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Username"
              value={username}
              onChangeText={text => setUsername(text)}
              placeholderTextColor="#000000" // Black placeholder text color
            />
            <TextInput
              style={styles.input}
              placeholder="Password"
              secureTextEntry={true}
              value={password}
              onChangeText={text => setPassword(text)}
              placeholderTextColor="#000000" // Black placeholder text color
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSignup}>
            <Text style={styles.signupText}>Don't have an account? <Text style={styles.signupLink}>Sign up</Text></Text>
          </TouchableOpacity>
        </View>
      </View>
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
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.14,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backgroundContainer: {
    backgroundColor: '#F0F0F0', // Background color for the container
    justifyContent: 'center',
    width: '90%', // Adjust width as needed
    height: windowHeight * 0.4, // Set to 70% of screen height
    bottom:'-33%',
    borderRadius:windowWidth*0.06,
    left:windowWidth*0.05,
  },
  
  container: {
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: windowHeight * 0.001,
    left:windowWidth*0.09,
  },
  input: {
    fontSize: 18, // Adjust the font size as needed
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: windowHeight * 0.03,
    width: '100%',
    backgroundColor: '#F9F9F9', // Light grey background color
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 2, // Shadow radius for iOS
  },
  button: {
    backgroundColor: '#603F83FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: windowWidth * 0.1,
    marginBottom: windowHeight * 0.03,
    left:windowWidth*0.07,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupText: {
    fontSize: 16,
    textAlign: 'center',
    fontWeight:'bold',
    left:windowWidth*0.09,
  },
  signupLink: {
    color: '#000000',
    textDecorationLine: 'underline',
  },
  heading: {
    fontSize: 26, // Adjust the font size as needed
    fontWeight: 'bold',
  },
  logo: {
    width: windowWidth * 0.75,
    height: windowHeight * 0.7,
    resizeMode: 'contain', // Adjust the image size and aspect ratio
    marginTop: windowHeight * 0.38,
  },
});

export default PatientLogin;
