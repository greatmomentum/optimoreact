import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { getFirestore, collection, query, where, getDocs } from '@firebase/firestore';
import { db } from '../firebase-config'; // Adjust the import path as needed

function PinVerificationScreen({ route, navigation }) {
  const { mobileNumber } = route.params;
  const [pin, setPin] = useState('');
  const [storedPin, setStoredPin] = useState('');

  useEffect(() => {
    fetchUserPin();
  }, []);

  const fetchUserPin = async () => {
    try {
      const q = query(collection(db, 'users'), where('phone_number', '==', mobileNumber));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0].data();
        setStoredPin(userDoc.pin_number);
      } else {
        Alert.alert('Error', 'User data not found');
        navigation.navigate('Login');
      }
    } catch (error) {
      console.error('Error fetching user PIN:', error);
      Alert.alert('Error', 'Failed to fetch user data');
      navigation.navigate('Login');
    }
  };

  const handlePinSubmit = () => {
    if (pin === storedPin) {
      // Check for pending data and navigate accordingly
      const q = query(collection(db, 'users'), where('phone_number', '==', mobileNumber));
      getDocs(q).then(querySnapshot => {
        if (!querySnapshot.empty) {
          const userDoc = querySnapshot.docs[0].data();
          if (userDoc.hasPendingData) {
            navigation.replace('Questions');
          } else {
            navigation.replace('Dashboard');
          }
        }
      }).catch(error => {
        console.error('Error checking pending data:', error);
        Alert.alert('Error', 'Failed to check pending data');
      });
    } else {
      Alert.alert('Incorrect PIN', 'Please try again');
      setPin('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enter Your PIN</Text>
      <TextInput
        style={styles.input}
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
        placeholder="Enter 4-digit PIN"
      />
      <TouchableOpacity style={styles.button} onPress={handlePinSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={styles.forgotPin}
        onPress={() => navigation.navigate('Login')} // Add a way to reset PIN or go back to login
      >
        <Text style={styles.forgotPinText}>Forgot PIN?</Text>
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
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 18,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPin: {
    marginTop: 20,
  },
  forgotPinText: {
    color: '#007AFF',
    fontSize: 16,
  },
});

export default PinVerificationScreen;
