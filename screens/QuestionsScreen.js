// screens/QuestionsScreen.js
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, StyleSheet, ScrollView } from 'react-native';

const questions = [
  {
    question: "What's your age group?",
    options: ['18-25', '26-35', '36-45', '46+']
  },
  {
    question: "What's your employment status?",
    options: ['Employed', 'Self-employed', 'Unemployed', 'Student']
  },
  {
    question: "What's your education level?",
    options: ['High School', 'Bachelor', 'Master', 'PhD']
  },
  {
    question: "What's your marital status?",
    options: ['Single', 'Married', 'Divorced', 'Widowed']
  },
  {
    question: "Do you own a house?",
    options: ['Yes', 'No']
  },
  {
    question: "Do you have any dependents?",
    options: ['Yes', 'No']
  }
];

function QuestionsScreen({ navigation }) {
  const [answers, setAnswers] = useState(Array(6).fill(null));
  const [yearlyIncome, setYearlyIncome] = useState('');
  const [monthlyExpenses, setMonthlyExpenses] = useState('');

  const handleAnswer = (questionIndex, answerIndex) => {
    const newAnswers = [...answers];
    newAnswers[questionIndex] = answerIndex;
    setAnswers(newAnswers);
  };

  const handleSubmit = () => {
    if (answers.includes(null) || !yearlyIncome || !monthlyExpenses) {
      alert('Please answer all questions and fill in your income and expenses.');
      return;
    }
    // Here you would typically send the answers to your backend
    console.log('Answers:', answers);
    console.log('Yearly Income:', yearlyIncome);
    console.log('Monthly Expenses:', monthlyExpenses);
    navigation.navigate('CustomFinancials');
  };

  return (
    <ScrollView style={styles.container}>
      {questions.map((q, qIndex) => (
        <View key={qIndex} style={styles.questionContainer}>
          <Text style={styles.questionText}>{q.question}</Text>
          {q.options.map((option, oIndex) => (
            <TouchableOpacity
              key={oIndex}
              style={[
                styles.optionButton,
                answers[qIndex] === oIndex && styles.selectedOption
              ]}
              onPress={() => handleAnswer(qIndex, oIndex)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      ))}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Yearly Income:</Text>
        <TextInput
          style={styles.input}
          value={yearlyIncome}
          onChangeText={setYearlyIncome}
          keyboardType="numeric"
          placeholder="Enter your yearly income"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Monthly Expenses:</Text>
        <TextInput
          style={styles.input}
          value={monthlyExpenses}
          onChangeText={setMonthlyExpenses}
          keyboardType="numeric"
          placeholder="Enter your monthly expenses"
        />
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  questionContainer: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  optionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
  },
  selectedOption: {
    backgroundColor: '#007AFF',
  },
  optionText: {
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default QuestionsScreen;