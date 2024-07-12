// screens/DashboardScreen.js
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { PieChart, LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

function DashboardScreen({ route }) {
  // Assuming we pass the user's name from the previous screen
  const { userName = 'User' } = route.params || {};

  // Sample data for charts
  const pieChartData = [
    { name: 'Mutual Funds', population: 35, color: 'rgba(131, 167, 234, 1)', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Fixed Deposit', population: 25, color: '#F00', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Gold', population: 15, color: '#FFD700', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Real Estate', population: 20, color: '#008000', legendFontColor: '#7F7F7F', legendFontSize: 12 },
    { name: 'Vehicle', population: 5, color: '#800080', legendFontColor: '#7F7F7F', legendFontSize: 12 },
  ];

  const lineChartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [{ data: [20, 45, 28, 80, 99, 43] }],
  };

  const barChartData = {
    labels: ['2019', '2020', '2021', '2022', '2023'],
    datasets: [{ data: [20, 45, 28, 80, 99] }],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.welcome}>Welcome, {userName}!</Text>
      
      <Text style={styles.sectionTitle}>Asset Allocation</Text>
      <PieChart
        data={pieChartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
        }}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
      />

      <Text style={styles.sectionTitle}>Investment Growth</Text>
      <LineChart
        data={lineChartData}
        width={screenWidth}
        height={220}
        chartConfig={{
          backgroundColor: '#e26a00',
          backgroundGradientFrom: '#fb8c00',
          backgroundGradientTo: '#ffa726',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: { borderRadius: 16 }
        }}
        bezier
        style={{ marginVertical: 8, borderRadius: 16 }}
      />

      <Text style={styles.sectionTitle}>Yearly Savings</Text>
      <BarChart
        data={barChartData}
        width={screenWidth}
        height={220}
        yAxisLabel="$"
        chartConfig={{
          backgroundColor: '#1cc910',
          backgroundGradientFrom: '#eff3ff',
          backgroundGradientTo: '#efefef',
          decimalPlaces: 2,
          color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          style: { borderRadius: 16 }
        }}
        style={{ marginVertical: 8, borderRadius: 16 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  welcome: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
});

export default DashboardScreen;