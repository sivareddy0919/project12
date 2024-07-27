import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Dimensions, Text, TouchableOpacity, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const GlucoseEntry = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { username } = route.params;  // Retrieve username from route params

  const [date, setDate] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [sugarConcentration, setSugarConcentration] = useState('');
  const [note, setNote] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [unit, setUnit] = useState('mmol/L');

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const showDatepicker = () => {
    setShowDatePicker(true);
  };

  const handleTimeChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setShowTimePicker(false);
    setTime(currentTime);
  };

  const showTimepicker = () => {
    setShowTimePicker(true);
  };

  const handleSugarConcentrationChange = (text) => {
    setSugarConcentration(text);
  };

  const handleNoteChange = (text) => {
    setNote(text);
  };

  const classifyTime = (time) => {
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const totalMinutes = hours * 60 + minutes;

    if (totalMinutes >= 420 && totalMinutes <= 600) { // 7:00 AM to 10:00 AM
      return 'Before Breakfast';
    } else if (totalMinutes >= 720 && totalMinutes <= 900) { // 12:00 PM to 3:00 PM
      return 'Before Lunch';
    } else if (totalMinutes >= 1140 && totalMinutes <= 1320) { // 7:00 PM to 10:00 PM
      return 'Before Dinner';
    } else {
      return 'Other';
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const session = classifyTime(time);

    const data = {
      date: date.toISOString().split('T')[0],
      time: time.toTimeString().split(' ')[0],
      sugarConcentration: parseFloat(sugarConcentration),
      note: note,
      unit: unit,
      session: session,
      username: username,  // Include username in the data to be submitted
      insulinintake: null, // Initially set insulinintake to null
      status: 'pending' // Initially set status to pending
    };

    try {
      const response = await fetch('http://192.168.40.121/Database/GlucoseEntry.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', result.message);
      } else {
        Alert.alert('Error', result.message);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to submit data');
    }

    setDate(new Date());
    setTime(new Date());
    setSugarConcentration('');
    setNote('');
    setUnit('mmol/L');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: "Cancel",
          onPress: () => console.log("Logout cancelled"),
          style: "cancel"
        },
        {
          text: "Yes",
          onPress: () => navigation.navigate('Patientlogin')
        }
      ],
      { cancelable: false }
    );
  };

  const handleHomePress = () => {
    navigation.navigate('Duplicate', { username });
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Text style={styles.heading}>Glucose Entry</Text>
      </View>
      <View style={styles.iconContainer}>
        <View style={styles.iconWithLabel}>
          <Text style={styles.iconLabel}>Before Breakfast</Text>
          <FontAwesome name="coffee" size={45} style={styles.icon} />
          <Text style={styles.iconLabel}>7AM - 10AM</Text>
        </View>
        <View style={styles.iconWithLabel}>
          <Text style={styles.iconLabel}>Before Lunch</Text>
          <FontAwesome name="cutlery" size={44.5} style={styles.icon} />
          <Text style={styles.iconLabel}>12PM - 3PM </Text>
        </View>
        <View style={styles.iconWithLabel}>
          <Text style={styles.iconLabel}>Before Dinner</Text>
          <FontAwesome name="moon-o" size={45} style={styles.icon} />
          <Text style={styles.iconLabel}>7PM - 10PM</Text>
        </View>
      </View>
      <View style={styles.formContainer}>
        <TouchableOpacity onPress={showDatepicker}>
          <Text style={styles.dateInput}>{date.toDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={handleDateChange}
          />
        )}
        <TouchableOpacity onPress={showTimepicker}>
          <Text style={styles.dateInput}>{time.toLocaleTimeString()}</Text>
        </TouchableOpacity>
        {showTimePicker && (
          <DateTimePicker
            testID="timePicker"
            value={time}
            mode="time"
            is24Hour={true}
            display="default"
            onChange={handleTimeChange}
          />
        )}

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Sugar Concentration"
            value={sugarConcentration}
            onChangeText={handleSugarConcentrationChange}
            placeholderTextColor="#000000"
            keyboardType="numeric"
          />
         <View style={styles.pickerContainer}>
            <Picker
              selectedValue={unit}
              style={styles.picker}
              onValueChange={(itemValue) => setUnit(itemValue)}
            >
              <Picker.Item label="mmol/L" value="mmol/L" />
              <Picker.Item label="mg/dL" value="mg/dL" />
            </Picker>
          </View>
        </View>
        <TextInput
          style={styles.textarea}
          placeholder="Note"
          multiline={true}
          numberOfLines={4}
          value={note}
          onChangeText={handleNoteChange}
          placeholderTextColor="#000000"
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.additionalGrayContainer}>
          <FontAwesome name="home" size={35} style={styles.homeIcon}  onPress={handleHomePress} />
          <FontAwesome name="bell" size={30} style={styles.bellIcon} />
          <FontAwesome name="sign-out" size={35} style={styles.signOutIcon} onPress={handleLogout} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const windowHeight = Dimensions.get('window').height;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingHorizontal: width * 0.01,
    paddingTop: windowHeight * 0.05,
  },
  topContainer: {
    paddingTop: windowHeight * 0.03,
    backgroundColor: '#603F83FF',
    borderBottomWidth: 0,
    borderBottomColor: 'black',
    height: windowHeight * 0.13,
    width: '150%',
    left: windowHeight * -0.1,
    justifyContent: 'center',
    alignItems: 'center',
    top: windowHeight * -0.051,
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: "#FFFFFF",
    top:windowHeight *0.012
  },
  formContainer: {
    flexGrow: 1,
    marginTop: 0,
  },
  dateInput: {
    fontSize: 17,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginTop: windowHeight * 0.09,
    marginBottom: windowHeight * -0.06,
    width: '90%',
    backgroundColor: '#F9F9F9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    left:windowHeight *0.025,
  },
  iconContainer: {
    flexDirection: 'row',
    backgroundColor: '#DFDFDF',
    justifyContent: 'space-around',
    width: '104%',
    borderRadius: 0,
    marginVertical: windowHeight * -0.051,
    paddingVertical: 10,
    left: windowHeight * -0.01,
  },
  iconWithLabel: {
    alignItems: 'center',
    color: '#603F83FF',
  },
  icon: {
    marginBottom: 5,
    color:'#603F83FF',
  },
  iconLabel: {
    fontSize: 12,
    textAlign: 'center',
    color: '#000000',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: windowHeight * 0.09,
    width:'80%'
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 13,
    marginBottom: windowHeight * 0.02,
    width: '60%',
    backgroundColor: '#F9F9F9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    left:windowHeight *0.027
  },
  pickerContainer: {
    width: '50%',  // Increased the width from 40% to 50%
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    backgroundColor: '#F9F9F9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    left: windowHeight * 0.035,
    marginBottom: windowHeight * 0.02,
  },
  picker: {
    width: windowHeight * 0.19,
    color: '#000000',
    paddingLeft: 0, // Adjust this value to reduce the gap
  },
  pickerItem: {
    height: 30,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: windowHeight * 0.05,
    marginTop:windowHeight *0.016,
    width: '90%',
    height: windowHeight * 0.15,
    backgroundColor: '#F9F9F9',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    textAlignVertical: 'top',
    left: windowHeight * 0.027,
  },
  button: {
    backgroundColor: '#603F83FF',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginTop: windowHeight * -0.02,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    left: 37,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  additionalGrayContainer: {
    flexDirection: 'row',
    backgroundColor: '#603F83FF',
    justifyContent: 'space-around',
    width: '90%',
    borderRadius: 25,
    paddingVertical: 15,
    left: windowHeight * 0.025,
    height: windowHeight * 0.085,
    marginTop:windowHeight*0.07,
  },
  homeIcon: {
    color:'#DFDFDF'
  },
  bellIcon: {
    color: '#DFDFDF'
  },
  signOutIcon: {
    color: '#DFDFDF'
  }
});

export default GlucoseEntry;
