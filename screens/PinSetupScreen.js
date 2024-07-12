// screens/PinSetupScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import { doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';

function PinSetupScreen({ navigation }) {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');

  const handlePinSetup = async () => {
    if (pin !== confirmPin) {
      alert('PINs do not match. Please try again.');
      return;
    }

    try {
      await updateDoc(doc(db, 'Users', auth.currentUser.uid), {
        pin_number: pin
      });
      navigation.navigate('Questions');
    } catch (error) {
      console.error('Error setting PIN:', error);
      alert('Failed to set PIN. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Set Your PIN</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter 4-digit PIN"
        value={pin}
        onChangeText={setPin}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm 4-digit PIN"
        value={confirmPin}
        onChangeText={setConfirmPin}
        keyboardType="numeric"
        maxLength={4}
        secureTextEntry
      />
      <Button title="Set PIN" onPress={handlePinSetup} />
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 5,
    textAlign: 'center',
  },
});

export default PinSetupScreen;
