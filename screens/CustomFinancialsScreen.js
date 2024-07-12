import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { auth, db } from '../firebase-config';

const tabs = ['Assets', 'Liabilities', 'Insurance'];

const dropdownItems = {
  Assets: [
    { label: 'Select an option', value: '' },
    { label: 'Mutual Funds', value: 'mutualFunds' },
    { label: 'Fixed Deposit', value: 'fixedDeposit' },
    { label: 'Gold', value: 'gold' },
    { label: 'Stocks', value: 'stocks' },
    { label: 'Real Estate', value: 'realEstate' },
    { label: 'Vehicle', value: 'vehicle' },
  ],
  Liabilities: [
    { label: 'Select an option', value: '' },
    { label: 'Home Loan', value: 'homeLoan' },
    { label: 'Vehicle Loan', value: 'vehicleLoan' },
    { label: 'Study Loan', value: 'studyLoan' },
    { label: 'Personal Loan', value: 'personalLoan' },
    { label: 'Business Loan', value: 'businessLoan' },
  ],
  Insurance: [
    { label: 'Select an option', value: '' },
    { label: 'Home Insurance', value: 'homeInsurance' },
    { label: 'Life Insurance', value: 'lifeInsurance' },
    { label: 'Medical Insurance', value: 'medicalInsurance' },
    { label: 'Other Insurance', value: 'otherInsurance' },
  ],
};

const instrumentFields = {
  mutualFunds: [
    { label: 'Investment Type', type: 'picker', options: ['Lumpsum', 'SIP'] },
    { label: 'Current Amount', type: 'input' },
    { label: 'SIP Amount', type: 'input', condition: 'SIP' },
  ],
  fixedDeposit: [
    { label: 'Enter Amount', type: 'input' },
    { label: 'Interest Value %', type: 'input' },
  ],
  gold: [
    { label: 'Gold Type', type: 'picker', options: ['Physical Gold', 'Gold ETFs', 'Sovereign Gold Bond'] },
    { label: 'Gold Quantity', type: 'input', condition: 'Physical Gold' },
    { label: 'Current Amount', type: 'input', condition: 'Gold ETFs' },
    { label: 'Total Amount', type: 'input', condition: 'Sovereign Gold Bond' },
  ],
  stocks: [{ label: 'Current Amount', type: 'input' }],
  realEstate: [
    { label: 'Type', type: 'picker', options: ['Self Occupied', 'Not Self Occupied'] },
    { label: 'Current Amount', type: 'input' },
  ],
  vehicle: [{ label: 'Current Amount', type: 'input' }],
  homeLoan: [
    { label: 'Loan Amount', type: 'input' },
    { label: 'EMI Amount', type: 'input' },
    { label: 'EMIs Remaining', type: 'input' },
  ],
  vehicleLoan: [
    { label: 'Loan Amount', type: 'input' },
    { label: 'EMI Amount', type: 'input' },
    { label: 'EMIs Remaining', type: 'input' },
  ],
  studyLoan: [
    { label: 'Loan Amount', type: 'input' },
    { label: 'EMI Amount', type: 'input' },
    { label: 'EMIs Remaining', type: 'input' },
  ],
  personalLoan: [
    { label: 'Loan Amount', type: 'input' },
    { label: 'EMI Amount', type: 'input' },
    { label: 'EMIs Remaining', type: 'input' },
  ],
  businessLoan: [
    { label: 'Loan Amount', type: 'input' },
    { label: 'EMI Amount', type: 'input' },
    { label: 'EMIs Remaining', type: 'input' },
  ],
  homeInsurance: [
    { label: 'Annual Premium', type: 'input' },
    { label: 'Sum Assured', type: 'input' },
  ],
  lifeInsurance: [
    { label: 'Annual Premium', type: 'input' },
    { label: 'Sum Assured', type: 'input' },
  ],
  medicalInsurance: [
    { label: 'Annual Premium', type: 'input' },
    { label: 'Sum Assured', type: 'input' },
  ],
  otherInsurance: [
    { label: 'Annual Premium', type: 'input' },
    { label: 'Sum Assured', type: 'input' },
  ],
};

function CustomFinancialsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('Assets');
  const [selectedInstrument, setSelectedInstrument] = useState('');
  const [fieldValues, setFieldValues] = useState({});
  const [labels, setLabels] = useState({});

  const handleFieldChange = (field, value) => {
    setFieldValues(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    console.log('Selected Instrument:', selectedInstrument);
    console.log('Field Values:', fieldValues);
    
    // Update labels
    setLabels(prev => ({
      ...prev,
      [selectedInstrument]: fieldValues
    }));

    // Reset fields
    setSelectedInstrument('');
    setFieldValues({});
  };

  const editLabel = (instrument) => {
    setSelectedInstrument(instrument);
    setFieldValues(labels[instrument]);
  };

  const renderFields = () => {
    if (!selectedInstrument) return null;

    return instrumentFields[selectedInstrument].map((field) => {
      if (field.type === 'input') {
        if (field.condition && fieldValues['Investment Type'] !== field.condition) return null;
        return (
          <View key={field.label} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}:</Text>
            <TextInput
              style={styles.input}
              onChangeText={(value) => handleFieldChange(field.label, value)}
              value={fieldValues[field.label] || ''}
              placeholder={`Enter ${field.label}`}
            />
          </View>
        );
      } else if (field.type === 'picker') {
        return (
          <View key={field.label} style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>{field.label}:</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={fieldValues[field.label] || ''}
                onValueChange={(itemValue) => handleFieldChange(field.label, itemValue)}
              >
                {field.options.map((option) => (
                  <Picker.Item key={option} label={option} value={option} />
                ))}
              </Picker>
            </View>
          </View>
        );
      }
    });
  };

  const renderLabels = () => {
    return Object.entries(labels).map(([instrument, values]) => (
      <TouchableOpacity key={instrument} style={styles.label} onPress={() => editLabel(instrument)}>
        <Text>{`${instrument}: ${JSON.stringify(values)}`}</Text>
      </TouchableOpacity>
    ));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Custom Financials</Text>
      
      <View style={styles.tabContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
          >
            <Text style={styles.tabText}>{tab}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedInstrument}
          onValueChange={(itemValue) => {
            setSelectedInstrument(itemValue);
            setFieldValues({});
          }}
        >
          {dropdownItems[activeTab].map((item) => (
            <Picker.Item key={item.value} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>

      {renderFields()}

      {selectedInstrument && (
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      )}

      {renderLabels()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... (previous styles)
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  tab: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  activeTab: {
    backgroundColor: '#007AFF',
  },
  tabText: {
    color: '#007AFF',
  },
  label: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginTop: 10,
  },
});

export default CustomFinancialsScreen;