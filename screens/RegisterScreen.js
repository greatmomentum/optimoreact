import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Platform, Alert } from 'react-native';
import { setDoc, doc, collection, query, where, getDocs } from '@firebase/firestore';
import { db } from '../firebase-config';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Location from 'expo-location';

function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [mobile, setMobile] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const calculateAge = (birthDate) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const getLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.log('Permission to access location was denied');
      return '';
    }

    let location = await Location.getCurrentPositionAsync({});
    return `${location.coords.latitude},${location.coords.longitude}`;
  };

  const handleRegister = async () => {
    if (!fullName || !mobile) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setIsLoading(true);

    try {
      const q = query(collection(db, 'Users'), where('phone_number', '==', mobile));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        Alert.alert('Error', 'Mobile number already exists');
        setIsLoading(false);
        return;
      }

      const deviceLocation = await getLocation();
      const userDocRef = doc(collection(db, 'Users'));

      await setDoc(userDocRef, {
        created_time: new Date(),
        date_of_birth: dateOfBirth.toISOString(),
        device_location: deviceLocation,
        display_name: fullName,
        phone_number: mobile,
        pin_number: Math.floor(1000 + Math.random() * 9000), // Generate a random 4-digit PIN
        user_age: calculateAge(dateOfBirth),
        user_id: userDocRef.id
      });

      navigation.navigate('OTP');
    } catch (error) {
      console.error('Error registering user:', error);
      Alert.alert('Error', 'Failed to register user');
    } finally {
      setIsLoading(false);
    }
  };

  const onChangeDateOfBirth = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />
      <TextInput
        style={styles.input}
        placeholder="Mobile"
        value={mobile}
        onChangeText={setMobile}
        keyboardType="phone-pad"
      />
      <TouchableOpacity style={styles.input} onPress={() => setShowDatePicker(true)}>
        <Text>{dateOfBirth.toDateString()}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={dateOfBirth}
          mode="date"
          is24Hour={true}
          display="default"
          onChange={onChangeDateOfBirth}
        />
      )}
      <TouchableOpacity 
        style={[styles.button, isLoading && styles.disabledButton]} 
        onPress={handleRegister}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Registering...' : 'Register'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: 'lightblue',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
