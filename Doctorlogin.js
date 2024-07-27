import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook

const DoctorLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Initialize navigation hook

  const handleLogin = () => {
    // Perform your login logic here
    const loginApiUrl = 'http://192.168.40.121/Database/Doctorlogin.php';
    
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
          navigation.navigate('Doctordashboard', { username }); // Pass username to dashboard screen
        } else {
          Alert.alert('Invalid username or password. Please try again.');
        }
      })
      .catch(error => {
        console.error('Login Error:', error);
        Alert.alert('Login failed. Please try again later.');
      });
  };
  
  return (
    <View style={styles.mainContainer}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Doctor Login</Text>
      </View>
      <Image
        source={require('./assets/scroll2.png')} // Replace with the actual path to your image
        style={styles.icon}
      />
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: '#603F83FF',
    paddingTop: windowHeight * 0.05,
    paddingHorizontal: windowWidth * 0.05,
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.14,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  backgroundContainer: {
    backgroundColor: '#F0F0F0', // Background color for the container
    justifyContent: 'center',
    alignItems: 'center',
    width: '90%', // Adjust width as needed
    height: windowHeight * 0.35, // Set to 40% of screen height
    borderRadius: windowWidth * 0.06,
    marginTop: windowHeight * 0.20,
    paddingHorizontal: windowWidth * 0.05,
    paddingBottom: windowHeight * 0.1,
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 2, // Shadow radius for iOS
    zIndex: 0,
  },
  container: {
    width: '100%',
    alignItems: 'center',
  },
  icon: {
    position: 'absolute',
    width: windowWidth * 0.8,
    height: windowWidth * 0.5,
    resizeMode: 'contain',
    top: windowHeight * 0.18,
  },
  inputContainer: {
    width: '95%',
    marginBottom: windowHeight * 0.02,
  },
  input: {
    fontSize: 18,
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: windowHeight * 0.02,
    width: '100%',
    backgroundColor: '#F9F9F9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  button: {
    backgroundColor: '#603F83FF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: windowWidth * 0.1,
    marginBottom: windowHeight * -0.1,
     marginTop: windowHeight * 0.00,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color:'#FFFFFF',
  },
});

export default DoctorLogin;
